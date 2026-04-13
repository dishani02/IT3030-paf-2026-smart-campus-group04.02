package com.sliit.smartcampus.dto;

import com.sliit.smartcampus.model.Ticket;
import lombok.Builder;
import lombok.Data;
import java.time.Duration;
import java.time.LocalDateTime;

@Data
@Builder
public class TicketSLADTO {
    private Long ticketId;
    private LocalDateTime createdAt;
    private LocalDateTime firstResponseAt;
    private LocalDateTime resolvedAt;
    private Long timeToFirstResponseMinutes;
    private Long timeToResolutionMinutes;

    public static TicketSLADTO from(Ticket ticket) {
        Long firstResponseMins = null;
        if (ticket.getFirstResponseAt() != null) {
            firstResponseMins = Duration.between(ticket.getCreatedAt(), ticket.getFirstResponseAt()).toMinutes();
        }

        Long resolutionMins = null;
        if (ticket.getResolvedAt() != null) {
            resolutionMins = Duration.between(ticket.getCreatedAt(), ticket.getResolvedAt()).toMinutes();
        }

        return TicketSLADTO.builder()
                .ticketId(ticket.getId())
                .createdAt(ticket.getCreatedAt())
                .firstResponseAt(ticket.getFirstResponseAt())
                .resolvedAt(ticket.getResolvedAt())
                .timeToFirstResponseMinutes(firstResponseMins)
                .timeToResolutionMinutes(resolutionMins)
                .build();
    }
}
