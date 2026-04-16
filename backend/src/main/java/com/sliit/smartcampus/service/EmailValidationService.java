package com.sliit.smartcampus.service;

import com.sliit.smartcampus.model.User;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class EmailValidationService {

    // Email pattern: it followed by exactly 8 digits @my.sliit.lk
    private static final Pattern STUDENT_PATTERN = Pattern.compile("^it\\d{8}@my\\.sliit\\.lk$");

    // Staff pattern: any email ending with @sliit.lk
    private static final Pattern STAFF_PATTERN = Pattern.compile("^[^@]+@sliit\\.lk$");

    // Admin pattern: any email ending with @admincampus.edu
    private static final Pattern ADMIN_PATTERN = Pattern.compile("^[^@]+@admincampus\\.edu$");

    // Technician pattern: any email ending with @techcampus.edu
    private static final Pattern TECHNICIAN_PATTERN = Pattern.compile("^[^@]+@techcampus\\.edu$");

    // Operations pattern: any email ending with @opscampus.edu
    private static final Pattern OPERATIONS_PATTERN = Pattern.compile("^[^@]+@opscampus\\.edu$");

    // Gmail pattern: standard user account for Google Sign-In (allowing both
    // gmail.com and googlemail.com)
    private static final Pattern GMAIL_PATTERN = Pattern.compile("^[^@]+@(gmail\\.com|googlemail\\.com)$");

    /**
     * Validates if the email matches any allowed institutional pattern
     * and returns the corresponding role. Throws exception if email is not allowed.
     */
    public User.Role validateAndAssignRole(String email) {
        if (STAFF_PATTERN.matcher(email).matches()) {
            return User.Role.STAFF;
        } else if (ADMIN_PATTERN.matcher(email).matches()) {
            return User.Role.ADMIN;
        } else if (TECHNICIAN_PATTERN.matcher(email).matches()) {
            return User.Role.TECHNICIAN;
        } else if (OPERATIONS_PATTERN.matcher(email).matches()) {
            return User.Role.OPERATIONS;
        } else {
            // Default to USER role for any student, external Google accounts, generic
            // emails, etc.
            return User.Role.USER;
        }
    }

    /**
     * Checks if an email is allowed to access the system
     */
    public boolean isEmailAllowed(String email) {
        try {
            validateAndAssignRole(email);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Extracts domain from email for error messages
     */
    private String extractDomain(String email) {
        int atIndex = email.lastIndexOf('@');
        return atIndex > 0 ? email.substring(atIndex + 1) : email;
    }

    /**
     * Gets user-friendly role description
     */
    public String getRoleDescription(User.Role role) {
        switch (role) {
            case USER:
                return "Student";
            case STAFF:
                return "Staff Member";
            case ADMIN:
                return "Administrator";
            case TECHNICIAN:
                return "Technician";
            case OPERATIONS:
                return "Operations Staff";
            default:
                return "Unknown Role";
        }
    }

    /**
     * Validates email format and provides specific error messages
     */
    public String getValidationMessage(String email) {
        if (email == null || email.trim().isEmpty()) {
            return "Email address is required";
        }

        if (!email.contains("@")) {
            return "Invalid email format";
        }

        try {
            User.Role role = validateAndAssignRole(email);
            return "Email validated successfully. Assigned role: " + getRoleDescription(role);
        } catch (IllegalArgumentException e) {
            return e.getMessage();
        }
    }
}
