package com.sliit.smartcampus.dto;

import com.sliit.smartcampus.model.Booking;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class BookingResponseDTO {
    private Long id;
    private Long resourceId;
    private String resourceName;
    private String resourceType;
    private String resourceLocation;
    private Long userId;
    private String userName;
    private String userEmail;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private String status;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static BookingResponseDTO from(Booking b) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(b.getId());
        dto.setResourceId(b.getResource().getId());
        dto.setResourceName(b.getResource().getName());
        dto.setResourceType(b.getResource().getType().name());
        dto.setResourceLocation(b.getResource().getLocation());
        dto.setUserId(b.getUser().getId());
        dto.setUserName(b.getUser().getName());
        dto.setUserEmail(b.getUser().getEmail());
        dto.setDate(b.getDate());
        dto.setStartTime(b.getStartTime());
        dto.setEndTime(b.getEndTime());
        dto.setPurpose(b.getPurpose());
        dto.setStatus(b.getStatus().name());
        dto.setRejectionReason(b.getRejectionReason());
        dto.setCreatedAt(b.getCreatedAt());
        dto.setUpdatedAt(b.getUpdatedAt());
        return dto;
    }
}
