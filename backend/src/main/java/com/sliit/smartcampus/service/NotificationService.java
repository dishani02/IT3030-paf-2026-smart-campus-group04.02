package com.sliit.smartcampus.service;

import com.sliit.smartcampus.model.Notification;
import com.sliit.smartcampus.model.User;
import com.sliit.smartcampus.repository.NotificationRepository;
import com.sliit.smartcampus.repository.UserRepository;
import com.sliit.smartcampus.model.User.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationPreferenceService preferenceService;

    public void createAndSaveNotification(User user, String message, String type) {
        if (!preferenceService.isEnabled(user.getId(), type)) {
            return;
        }
        Notification notification = Notification.builder()
                .user(user)
                .message(message)
                .type(type)
                .read(false)
                .targetRole(null)
                .relatedType(null)
                .relatedId(null)
                .build();
        notificationRepository.save(notification);
    }

    public void createAdminNotification(String message, String type, String relatedType, Long relatedId) {
        createRoleNotification("ADMIN", message, type, relatedType, relatedId);
    }

    public void createRoleNotification(String targetRole, String message, String type, String relatedType,
            Long relatedId) {
        Notification notification = Notification.builder()
                .user(null)
                .message(message)
                .type(type)
                .read(false)
                .targetRole(targetRole)
                .relatedType(relatedType)
                .relatedId(relatedId)
                .build();
        notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    public long getAdminUnreadCount() {
        return notificationRepository.countByTargetRoleAndReadFalse("ADMIN");
    }

    public long getUnreadCountForRole(String targetRole) {
        return notificationRepository.countByTargetRoleAndReadFalse(targetRole);
    }

    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(
                        () -> new com.sliit.smartcampus.exception.ResourceNotFoundException("Notification not found"));
        if (notification.getUser() != null) {
            if (!notification.getUser().getId().equals(userId)) {
                throw new com.sliit.smartcampus.exception.ForbiddenException(
                        "Cannot access another user's notification");
            }
        } else {
            // admin/system notification: only admins can mark
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new com.sliit.smartcampus.exception.ResourceNotFoundException(
                            "User not found: " + userId));
            if (user.getRole() != Role.ADMIN) {
                throw new com.sliit.smartcampus.exception.ForbiddenException(
                        "Only admins can access system notifications");
            }
        }
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    public void markAllAdminAsRead(Long adminUserId) {
        User user = userRepository.findById(adminUserId)
                .orElseThrow(() -> new com.sliit.smartcampus.exception.ResourceNotFoundException(
                        "User not found: " + adminUserId));
        if (user.getRole() != Role.ADMIN) {
            throw new com.sliit.smartcampus.exception.ForbiddenException("Only admins can mark system notifications");
        }
        List<Notification> notifications = notificationRepository.findByTargetRoleOrderByCreatedAtDesc("ADMIN");
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    public void markAllForRole(String targetRole, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.sliit.smartcampus.exception.ResourceNotFoundException(
                        "User not found: " + userId));
        // Only allow if the user's role matches the targetRole or user is ADMIN
        if (!user.getRole().name().equals(targetRole) && user.getRole() != Role.ADMIN) {
            throw new com.sliit.smartcampus.exception.ForbiddenException(
                    "Only users of role " + targetRole + " or admins can mark these notifications");
        }
        List<Notification> notifications = notificationRepository.findByTargetRoleOrderByCreatedAtDesc(targetRole);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    public List<Notification> getAdminNotifications() {
        return notificationRepository.findByTargetRoleOrderByCreatedAtDesc("ADMIN");
    }

    public List<Notification> getNotificationsForRole(String targetRole) {
        return notificationRepository.findByTargetRoleOrderByCreatedAtDesc(targetRole);
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteNotification(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new com.sliit.smartcampus.exception.ResourceNotFoundException("Notification not found: " + notificationId));
        
        if (notification.getUser() != null) {
            if (!notification.getUser().getId().equals(userId)) {
                throw new com.sliit.smartcampus.exception.ForbiddenException("Cannot delete another user's notification");
            }
        } else {
            // Admin/system notification: verify user is admin
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new com.sliit.smartcampus.exception.ResourceNotFoundException("User not found: " + userId));
            if (user.getRole() != Role.ADMIN) {
                throw new com.sliit.smartcampus.exception.ForbiddenException("Only admins can delete system notifications");
            }
        }
        
        notificationRepository.delete(notification);
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteAllNotifications(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        notificationRepository.deleteAll(notifications);
    }
}