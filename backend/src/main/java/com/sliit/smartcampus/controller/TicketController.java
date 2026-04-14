package com.sliit.smartcampus.controller;

import com.campus.campushub.dto.*;
import com.campus.campushub.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;
    // private final AuthService authService; // Available from Member 2

    // POST /api/tickets - Create Ticket
    @PostMapping
    public ResponseEntity<TicketResponseDTO> createTicket(
            @RequestBody TicketRequestDTO request,
            @RequestHeader("userId") Long userId) {
        // Long userId = authService.getCurrentUserId(); // Uncomment after auth is ready
        TicketResponseDTO response = ticketService.createTicket(request, userId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // GET /api/tickets - Get All Tickets (role-based)
    @GetMapping
    public ResponseEntity<List<TicketResponseDTO>> getAllTickets(
            @RequestHeader("userId") Long userId,
            @RequestHeader("role") String role) {
        List<TicketResponseDTO> tickets = ticketService.getAllTickets(userId, role);
        return ResponseEntity.ok(tickets);
    }

    // GET /api/tickets/{id} - Get Ticket by ID
    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDTO> getTicketById(@PathVariable Long id) {
        TicketResponseDTO ticket = ticketService.getTicketById(id);
        return ResponseEntity.ok(ticket);
    }

    // GET /api/tickets/{id}/sla - Get SLA Information
    @GetMapping("/{id}/sla")
    public ResponseEntity<TicketSLADTO> getTicketSLA(@PathVariable Long id) {
        TicketSLADTO sla = ticketService.getTicketSLA(id);
        return ResponseEntity.ok(sla);
    }

    // PUT /api/tickets/{id}/assign - Assign Technician
    @PutMapping("/{id}/assign")
    public ResponseEntity<TicketResponseDTO> assignTechnician(
            @PathVariable Long id,
            @RequestParam Long technicianId) {
        TicketResponseDTO response = ticketService.assignTechnician(id, technicianId);
        return ResponseEntity.ok(response);
    }

    // PUT /api/tickets/{id}/status - Update Status
    @PutMapping("/{id}/status")
    public ResponseEntity<TicketResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        TicketResponseDTO response = ticketService.updateStatus(id, status);
        return ResponseEntity.ok(response);
    }

    // POST /api/tickets/{id}/comments - Add Comment
    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentDTO> addComment(
            @PathVariable Long id,
            @RequestParam String content,
            @RequestHeader("userId") Long userId) {
        CommentDTO comment = ticketService.addComment(id, userId, content);
        return new ResponseEntity<>(comment, HttpStatus.CREATED);
    }

    // GET /api/tickets/{id}/comments - Get Comments
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentDTO>> getComments(@PathVariable Long id) {
        List<CommentDTO> comments = ticketService.getCommentsByTicketId(id);
        return ResponseEntity.ok(comments);
    }

    // POST /api/tickets/{id}/attachments - Add Attachment
    @PostMapping("/{id}/attachments")
    public ResponseEntity<AttachmentDTO> addAttachment(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestHeader("userId") Long userId) throws IOException {
        AttachmentDTO attachment = ticketService.addAttachment(id, userId, file);
        return new ResponseEntity<>(attachment, HttpStatus.CREATED);
    }

    // GET /api/tickets/{id}/attachments - Get Attachments
    @GetMapping("/{id}/attachments")
    public ResponseEntity<List<AttachmentDTO>> getAttachments(@PathVariable Long id) {
        List<AttachmentDTO> attachments = ticketService.getAttachmentsByTicketId(id);
        return ResponseEntity.ok(attachments);
    }
}