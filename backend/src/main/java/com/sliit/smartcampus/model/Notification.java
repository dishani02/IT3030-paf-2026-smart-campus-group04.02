package com.sliit.smartcampus.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private String type;

    @Column(name = "is_read")
    @Builder.Default
    private boolean read = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
    
    @Column(name = "target_role")
    private String targetRole; // e.g. "ADMIN" for system/admin notifications

    @Column(name = "related_type")
    private String relatedType; // e.g. BOOKING, TICKET, RESOURCE

    @Column(name = "related_id")
    private Long relatedId; // id of related entity when applicable
}
