package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.dto.NotificationDTO;
import com.sliit.smartcampus.model.User;
import com.sliit.smartcampus.service.AuthService;
import com.sliit.smartcampus.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getNotifications(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        List<NotificationDTO> dtos;
        switch (user.getRole()) {
            case ADMIN:
                dtos = notificationService.getAdminNotifications().stream().map(NotificationDTO::from)
                        .collect(Collectors.toList());
                break;
            case OPERATIONS:
                dtos = notificationService.getNotificationsForRole("OPERATIONS").stream().map(NotificationDTO::from)
                        .collect(Collectors.toList());
                break;
            default:
                // USER and TECHNICIAN get their user-specific notifications
                dtos = notificationService.getUserNotifications(user.getId())
                        .stream().map(NotificationDTO::from).collect(Collectors.toList());
        }
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        long count;
        switch (user.getRole()) {
            case ADMIN:
                count = notificationService.getAdminUnreadCount();
                break;
            case OPERATIONS:
                count = notificationService.getUnreadCountForRole("OPERATIONS");
                break;
            default:
                count = notificationService.getUnreadCount(user.getId());
        }
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        notificationService.markAsRead(id, user.getId());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        if (user.getRole() == com.sliit.smartcampus.model.User.Role.ADMIN) {
            notificationService.markAllAdminAsRead(user.getId());
        } else if (user.getRole() == com.sliit.smartcampus.model.User.Role.OPERATIONS) {
            // mark all role-targeted notifications as read for OPERATIONS
            notificationService.markAllForRole("OPERATIONS", user.getId());
        } else {
            notificationService.markAllAsRead(user.getId());
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long id,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        notificationService.deleteNotification(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/all")
    public ResponseEntity<Void> deleteAllNotifications(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        notificationService.deleteAllNotifications(user.getId());
        return ResponseEntity.noContent().build();
    }
}