package com.sliit.smartcampus.dto;

import com.sliit.smartcampus.model.Notification;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificationDTO {
    private Long id;
    private String message;
    private String type;
    private boolean read;
    private LocalDateTime createdAt;
    private String targetRole;
    private String relatedType;
    private Long relatedId;

    public static NotificationDTO from(Notification n) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(n.getId());
        dto.setMessage(n.getMessage());
        dto.setType(n.getType());
        dto.setRead(n.isRead());
        dto.setCreatedAt(n.getCreatedAt());
        dto.setTargetRole(n.getTargetRole());
        dto.setRelatedType(n.getRelatedType());
        dto.setRelatedId(n.getRelatedId());
        return dto;
    }
}
