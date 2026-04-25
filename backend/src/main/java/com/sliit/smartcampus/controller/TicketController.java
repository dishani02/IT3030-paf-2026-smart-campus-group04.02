package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.dto.TicketRequestDTO;
import com.sliit.smartcampus.dto.TicketResponseDTO;
import com.sliit.smartcampus.dto.TicketSLADTO;
import com.sliit.smartcampus.model.User;
import com.sliit.smartcampus.service.AuthService;
import com.sliit.smartcampus.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.access.prepost.PreAuthorize;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final AuthService authService;

    @PostMapping
    public ResponseEntity<TicketResponseDTO> createTicket(
            @Valid @RequestBody TicketRequestDTO dto,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(ticketService.createTicket(dto, user));
    }

    @GetMapping
    public ResponseEntity<List<TicketResponseDTO>> getTickets(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(ticketService.getAllTickets(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDTO> getTicket(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @GetMapping("/{id}/sla")
    public ResponseEntity<TicketSLADTO> getTicketSLA(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketSLA(id));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<TicketResponseDTO> assignTechnician(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        Long technicianId = body.get("technicianId");
        return ResponseEntity.ok(ticketService.assignTechnician(id, technicianId, user));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TicketResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        String status = body.get("status");
        String notes = body.get("resolutionNotes");
        String reason = body.get("rejectionReason");
        return ResponseEntity.ok(ticketService.updateStatus(id, status, notes, reason, user));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketResponseDTO> addComment(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        String content = body.get("content");
        if (content == null || content.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(ticketService.addComment(id, content, user));
    }

    @PostMapping("/{id}/attachments")
    public ResponseEntity<TicketResponseDTO> addAttachment(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) throws IOException {
        User user = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(ticketService.addAttachment(id, file, user));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Void> deleteTicket(
            @PathVariable Long id,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        ticketService.deleteTicket(id, user);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id,
            @PathVariable Long commentId,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        ticketService.deleteComment(id, commentId, user);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<TicketResponseDTO> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(ticketService.addImage(id, file, user));
    }

    @DeleteMapping("/{id}/images")
    public ResponseEntity<TicketResponseDTO> deleteImage(
            @PathVariable Long id,
            @RequestParam("imageUrl") String imageUrl,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(ticketService.removeImage(id, imageUrl, user));
    }
}
