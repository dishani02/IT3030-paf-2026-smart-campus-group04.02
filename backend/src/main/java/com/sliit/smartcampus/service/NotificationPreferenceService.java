package com.sliit.smartcampus.service;

import com.sliit.smartcampus.model.NotificationPreference;
import com.sliit.smartcampus.repository.NotificationPreferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NotificationPreferenceService {

    private final NotificationPreferenceRepository repository;

    private static final List<String> DEFAULT_CATEGORIES = Arrays.asList(
            "BOOKING_APPROVED",
            "BOOKING_REJECTED",
            "BOOKING_CANCELLED",
            "TICKET_STATUS_CHANGED",
            "TICKET_COMMENT",
            "TICKET_ASSIGNED",
            "TICKET_CREATED"
    );

    @Transactional
    public List<NotificationPreference> getPreferences(Long userId) {
        List<NotificationPreference> preferences = repository.findByUserId(userId);
        
        // If some categories are missing, create defaults
        List<String> existingCategories = preferences.stream()
                .map(NotificationPreference::getCategory)
                .toList();

        boolean createdAny = false;
        for (String category : DEFAULT_CATEGORIES) {
            if (!existingCategories.contains(category)) {
                NotificationPreference pref = NotificationPreference.builder()
                        .userId(userId)
                        .category(category)
                        .enabled(true)
                        .build();
                repository.save(pref);
                preferences.add(pref);
                createdAny = true;
            }
        }
        
        if (createdAny) {
            // Re-fetch to return the list with IDs
            return repository.findByUserId(userId);
        }
        
        return preferences;
    }

    @Transactional
    public NotificationPreference updatePreference(Long userId, String category, boolean enabled) {
        NotificationPreference pref = repository.findByUserIdAndCategory(userId, category)
                .orElseGet(() -> NotificationPreference.builder()
                        .userId(userId)
                        .category(category)
                        .enabled(enabled)
                        .build());
        pref.setEnabled(enabled);
        return repository.save(pref);
    }

    public boolean isEnabled(Long userId, String category) {
        Optional<NotificationPreference> pref = repository.findByUserIdAndCategory(userId, category);
        // Default to true if not set
        return pref.map(NotificationPreference::isEnabled).orElse(true);
    }
}
