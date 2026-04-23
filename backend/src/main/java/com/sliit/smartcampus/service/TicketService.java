package com.sliit.smartcampus.service;

import com.sliit.smartcampus.dto.TicketRequestDTO;
import com.sliit.smartcampus.dto.TicketResponseDTO;
import com.sliit.smartcampus.dto.TicketSLADTO;
import com.sliit.smartcampus.exception.ConflictException;
import com.sliit.smartcampus.exception.ForbiddenException;
import com.sliit.smartcampus.exception.ResourceNotFoundException;
import com.sliit.smartcampus.model.*;
import com.sliit.smartcampus.model.Ticket.Priority;
import com.sliit.smartcampus.model.Ticket.TicketStatus;
import com.sliit.smartcampus.model.User.Role;
import com.sliit.smartcampus.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final CommentRepository commentRepository;
    private final AttachmentRepository attachmentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final FileStorageService fileStorageService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Transactional
    public TicketResponseDTO createTicket(TicketRequestDTO dto, User reporter) {
        Ticket ticket = Ticket.builder()
                .title(dto.getTitle())
                .resourceOrLocation(dto.getResourceOrLocation())
                .category(dto.getCategory())
                .description(dto.getDescription())
                .priority(Priority.valueOf(dto.getPriority().toUpperCase()))
                .status(TicketStatus.OPEN)
                .reporter(reporter)
                .build();

        ticket = ticketRepository.save(ticket);
        // Notify admins about new ticket
        notificationService.createAdminNotification(
                "New incident reported: " + ticket.getTitle(),
                "TICKET_CREATED",
                "TICKET",
                ticket.getId());
        // Notify reporter (user) that ticket was created
        notificationService.createAndSaveNotification(ticket.getReporter(),
                "Your ticket '" + ticket.getTitle() + "' has been created.",
                "TICKET_CREATED");
        return TicketResponseDTO.from(ticket);
    }

    public List<TicketResponseDTO> getAllTickets(User currentUser) {
        List<Ticket> tickets;
        switch (currentUser.getRole()) {
            case TECHNICIAN:
                tickets = ticketRepository.findByAssignedTechnicianIdOrderByCreatedAtDesc(currentUser.getId());
                break;
            case USER:
                tickets = ticketRepository.findByReporterIdOrderByCreatedAtDesc(currentUser.getId());
                break;
            default:
                tickets = ticketRepository.findAllByOrderByCreatedAtDesc();
        }
        return tickets.stream().map(TicketResponseDTO::from).collect(Collectors.toList());
    }

    public TicketResponseDTO getTicketById(Long id) {
        Ticket ticket = getOrThrow(id);
        return TicketResponseDTO.from(ticket);
    }

    @Transactional
    public TicketResponseDTO assignTechnician(Long ticketId, Long technicianId, User assigner) {
        if (assigner.getRole() != Role.ADMIN) {
            throw new ForbiddenException("Only admins can assign technicians.");
        }
        Ticket ticket = getOrThrow(ticketId);
        User technician = userRepository.findById(technicianId)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found: " + technicianId));
        if (technician.getRole() != Role.TECHNICIAN) {
            throw new IllegalArgumentException("User is not a technician.");
        }

        ticket.setAssignedTechnician(technician);
        if (ticket.getStatus() == TicketStatus.OPEN) {
            ticket.setStatus(TicketStatus.IN_PROGRESS);
            if (ticket.getFirstResponseAt() == null) {
                ticket.setFirstResponseAt(LocalDateTime.now());
            }
        }
        ticket = ticketRepository.save(ticket);

        notificationService.createAndSaveNotification(technician,
                "You have been assigned to ticket: " + ticket.getTitle(), "TICKET_ASSIGNED");
        notificationService.createAndSaveNotification(ticket.getReporter(),
                "A technician has been assigned to your ticket: " + ticket.getTitle(), "TICKET_ASSIGNED");
        // Optional admin awareness
        notificationService.createAdminNotification(
                "Technician assigned to ticket #" + ticket.getId() + ": " + ticket.getTitle(),
                "TICKET_ASSIGNED",
                "TICKET",
                ticket.getId());

        return TicketResponseDTO.from(ticket);
    }

    @Transactional
    public TicketResponseDTO updateStatus(Long ticketId, String newStatus, String notes, String reason, User actor) {
        Ticket ticket = getOrThrow(ticketId);

        TicketStatus status;
        try {
            status = TicketStatus.valueOf(newStatus.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid ticket status: " + newStatus);
        }

        // Permission checks
        if (status == TicketStatus.REJECTED && actor.getRole() != Role.ADMIN) {
            throw new ForbiddenException("Only admins can reject tickets.");
        }
        if ((status == TicketStatus.RESOLVED || status == TicketStatus.IN_PROGRESS)
                && actor.getRole() != Role.TECHNICIAN && actor.getRole() != Role.ADMIN) {
            throw new ForbiddenException("Only technicians or admins can update ticket status to " + newStatus);
        }

        if (ticket.getStatus() == TicketStatus.OPEN && status != TicketStatus.OPEN) {
            if (ticket.getFirstResponseAt() == null) {
                ticket.setFirstResponseAt(LocalDateTime.now());
            }
        }
        
        ticket.setStatus(status);
        
        if (status == TicketStatus.RESOLVED) {
            ticket.setResolvedAt(LocalDateTime.now());
        }

        if (notes != null && !notes.isBlank()) {
            ticket.setResolutionNotes(notes);
        }
        if (reason != null && !reason.isBlank()) {
            ticket.setRejectionReason(reason);
        }
        ticket = ticketRepository.save(ticket);

        notificationService.createAndSaveNotification(ticket.getReporter(),
                "Your ticket '" + ticket.getTitle() + "' status changed to: " + status.name(), "TICKET_STATUS_CHANGED");

        // Notify admins when technician updates status or when ticket is resolved
        if (actor.getRole() == Role.TECHNICIAN) {
            notificationService.createAdminNotification(
                    "Ticket #" + ticket.getId() + " marked as " + status.name() + " by technician",
                    "TICKET_STATUS_UPDATE",
                    "TICKET",
                    ticket.getId());
        }
        if (status == TicketStatus.RESOLVED) {
            notificationService.createAdminNotification(
                    "Ticket #" + ticket.getId() + " has been resolved",
                    "TICKET_RESOLVED",
                    "TICKET",
                    ticket.getId());
        }

        return TicketResponseDTO.from(ticket);
    }

    @Transactional
    public TicketResponseDTO addComment(Long ticketId, String content, User author) {
        Ticket ticket = getOrThrow(ticketId);

        Comment comment = Comment.builder()
                .ticket(ticket)
                .author(author)
                .content(content)
                .build();
        commentRepository.save(comment);
        ticket.getComments().add(comment);

        // Notify reporter if commenter is not reporter
        if (!author.getId().equals(ticket.getReporter().getId())) {
            notificationService.createAndSaveNotification(ticket.getReporter(),
                    "New comment on your ticket: " + ticket.getTitle(), "TICKET_COMMENT");
        }
        // Notify technician if present and commenter is not technician
        if (ticket.getAssignedTechnician() != null
                && !author.getId().equals(ticket.getAssignedTechnician().getId())) {
            notificationService.createAndSaveNotification(ticket.getAssignedTechnician(),
                    "New comment on ticket: " + ticket.getTitle(), "TICKET_COMMENT");
        }

        return TicketResponseDTO.from(ticketRepository.findById(ticketId).get());
    }

    @Transactional
    public TicketResponseDTO addAttachment(Long ticketId, MultipartFile file, User actor) throws IOException {
        Ticket ticket = getOrThrow(ticketId);

        long existingCount = attachmentRepository.countByTicketId(ticketId);
        if (existingCount >= 3) {
            throw new ConflictException("Maximum 3 attachments allowed per ticket.");
        }

        Path uploadPath = Paths.get(uploadDir, "tickets", ticketId.toString());
        Files.createDirectories(uploadPath);

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        Attachment attachment = Attachment.builder()
                .ticket(ticket)
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .filePath("/uploads/tickets/" + ticketId + "/" + fileName)
                .build();
        attachmentRepository.save(attachment);

        return TicketResponseDTO.from(ticketRepository.findById(ticketId).get());
    }

    public TicketSLADTO getTicketSLA(Long id) {
        Ticket ticket = getOrThrow(id);
        return TicketSLADTO.from(ticket);
    }

    @Transactional
    public void deleteTicket(Long id, User user) {
        if (user.getRole() != Role.ADMIN) {
            throw new ForbiddenException("Only admins can delete tickets.");
        }
        Ticket ticket = getOrThrow(id);
        ticketRepository.delete(ticket);
    }

    @Transactional
    public void deleteComment(Long ticketId, Long commentId, User user) {
        Ticket ticket = getOrThrow(ticketId);
        
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found: " + commentId));

        if (!comment.getTicket().getId().equals(ticketId)) {
            throw new ResourceNotFoundException("Comment does not belong to the specified ticket.");
        }

        if (user.getRole() != Role.ADMIN && !comment.getAuthor().getId().equals(user.getId())) {
            throw new ForbiddenException("You can only delete your own comments.");
        }

        commentRepository.delete(comment);
    }

    private Ticket getOrThrow(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + id));
    }

    @Transactional
    public TicketResponseDTO addImage(Long ticketId, MultipartFile file, User user) {
        Ticket ticket = getOrThrow(ticketId);
        
        if (user.getRole() != Role.ADMIN && !ticket.getReporter().getId().equals(user.getId())) {
            throw new ForbiddenException("Only the ticket creator or admins can upload images.");
        }

        if (ticket.getImages().size() >= 5) {
            throw new ConflictException("Maximum 5 images allowed per ticket.");
        }
        
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed.");
        }
        
        String fileUrl = fileStorageService.storeFile(file);
        ticket.getImages().add(fileUrl);
        return TicketResponseDTO.from(ticketRepository.save(ticket));
    }

    @Transactional
    public TicketResponseDTO removeImage(Long ticketId, String imageUrl, User user) {
        Ticket ticket = getOrThrow(ticketId);
        
        if (user.getRole() != Role.ADMIN && !ticket.getReporter().getId().equals(user.getId())) {
            throw new ForbiddenException("Only the ticket creator or admins can delete images.");
        }

        if (ticket.getImages().remove(imageUrl)) {
            fileStorageService.deleteFile(imageUrl);
            return TicketResponseDTO.from(ticketRepository.save(ticket));
        }
        throw new ResourceNotFoundException("Image URL not found for this ticket");
    }
}