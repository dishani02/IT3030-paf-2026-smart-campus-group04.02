package com.sliit.smartcampus.dto;

import com.sliit.smartcampus.model.Ticket;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

// @Data
public class TicketResponseDTO {
    private Long id;
    private String title;
    private String resourceOrLocation;
    private String category;
    private String description;
    private String priority;
    private String status;
    private Long reporterId;
    private String reporterName;
    private Long assignedTechnicianId;
    private String assignedTechnicianName;
    private String resolutionNotes;
    private String rejectionReason;
    // private List<CommentDTO> comments;
    // private List<AttachmentDTO> attachments;
    private LocalDateTime firstResponseAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
    // @Data
    // public static class AttachmentDTO {
    //     private Long id;
    //     private String fileName;
    //     private String fileType;
    //     private String filePath;
    // }

    // public static TicketResponseDTO from(Ticket t) {
        // TicketResponseDTO dto = new TicketResponseDTO();
        // dto.setId(t.getId());
        // dto.setTitle(t.getTitle());
        // dto.setResourceOrLocation(t.getResourceOrLocation());
        // dto.setCategory(t.getCategory());
        // dto.setDescription(t.getDescription());
        // dto.setPriority(t.getPriority().name());
        // dto.setStatus(t.getStatus().name());
        // dto.setReporterId(t.getReporter().getId());
        // dto.setReporterName(t.getReporter().getName());
        // if (t.getAssignedTechnician() != null) {
        //     dto.setAssignedTechnicianId(t.getAssignedTechnician().getId());
        //     dto.setAssignedTechnicianName(t.getAssignedTechnician().getName());
        // }
        // dto.setResolutionNotes(t.getResolutionNotes());
        // dto.setRejectionReason(t.getRejectionReason());
        // dto.setFirstResponseAt(t.getFirstResponseAt());
        // dto.setResolvedAt(t.getResolvedAt());
        // dto.setCreatedAt(t.getCreatedAt());
        // dto.setUpdatedAt(t.getUpdatedAt());
        // dto.setComments(t.getComments().stream()
                // .map(c -> {
                    // CommentDTO cd = new CommentDTO();
                    // cd.setId(c.getId());
                    // cd.setAuthorId(c.getAuthor().getId());
                    // cd.setAuthorName(c.getAuthor().getName());
                    // cd.setAuthorRole(c.getAuthor().getRole().name());
                    // cd.setContent(c.getContent());
                    // cd.setCreatedAt(c.getCreatedAt());
                    // return cd;
                // }).collect(Collectors.toList()));
        // dto.setAttachments(t.getAttachments().stream()
    //             .map(a -> {
    //                 AttachmentDTO ad = new AttachmentDTO();
    //                 ad.setId(a.getId());
    //                 ad.setFileName(a.getFileName());
    //                 ad.setFileType(a.getFileType());
    //                 ad.setFilePath(a.getFilePath());
    //                 return ad;
    //             }).collect(Collectors.toList()));
    //     return dto;
    // }
// }
