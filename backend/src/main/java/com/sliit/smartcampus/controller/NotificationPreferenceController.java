package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.model.NotificationPreference;
import com.sliit.smartcampus.model.User;
import com.sliit.smartcampus.service.AuthService;
import com.sliit.smartcampus.service.NotificationPreferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notification-preferences")
@RequiredArgsConstructor
public class NotificationPreferenceController {

    private final NotificationPreferenceService preferenceService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<NotificationPreference>> getPreferences(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(preferenceService.getPreferences(user.getId()));
    }

    @PutMapping("/{category}")
    public ResponseEntity<NotificationPreference> updatePreference(
            @PathVariable String category,
            @RequestBody Map<String, Boolean> body,
            Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        boolean enabled = body.getOrDefault("enabled", true);
        return ResponseEntity.ok(preferenceService.updatePreference(user.getId(), category, enabled));
    }
}
