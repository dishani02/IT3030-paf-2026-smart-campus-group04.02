package com.sliit.smartcampus.controller;

/** Authentication and user account controller */
import com.sliit.smartcampus.dto.AuthResponseDTO;
import com.sliit.smartcampus.dto.GoogleAuthRequestDTO;
import com.sliit.smartcampus.dto.LoginRequestDTO;
import com.sliit.smartcampus.model.User;
import com.sliit.smartcampus.service.AuthService;
import com.sliit.smartcampus.service.EmailValidationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final EmailValidationService emailValidationService;

    /** Standard email/password login */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO request) {
        System.out.println(">>> LOGIN REQUEST for: " + request.getEmail());
        try {
            AuthResponseDTO response = authService.login(request);
            System.out.println("<<< LOGIN SUCCESS for: " + request.getEmail());
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            System.err.println("!!! LOGIN FAILED for: " + request.getEmail() + " - " + e.getMessage());
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        } catch (Exception e) {
            System.err.println("!!! LOGIN ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Internal server error: " + e.getMessage()));
        }
    }

    /** Register a new user account */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String password = request.get("password");

        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Full name is required"));
        }
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }
        if (password == null || password.length() < 8) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must be at least 8 characters"));
        }

        try {
            System.out.println(">>> REGISTER REQUEST for: " + email);
            AuthResponseDTO response = authService.register(name.trim(), email.trim(), password);
            System.out.println("<<< REGISTER SUCCESS for: " + email);
            return ResponseEntity.status(201).body(response);
        } catch (IllegalArgumentException e) {
            // Invalid email domain
            System.err.println("!!! REGISTER REJECTED: domain not allowed - " + email);
            return ResponseEntity.status(403).body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            // Duplicate email
            System.err.println("!!! REGISTER REJECTED: account exists - " + email);
            return ResponseEntity.status(409).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            System.err.println("!!! REGISTER ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Internal server error: " + e.getMessage()));
        }
    }

    /**
     * Google OAuth2 login.
     * The frontend sends the Google ID token (obtained from @react-oauth/google).
     * We verify it, then return a Campus JWT — same flow as local login.
     */
    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@Valid @RequestBody GoogleAuthRequestDTO request) {
        try {
            AuthResponseDTO response = authService.loginWithGoogle(request.getIdToken());
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("message", "Google sign-in failed: " + e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Authentication failed: " + e.getMessage()));
        }
    }

    /** Returns the currently authenticated user's profile */
    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        }
        String email = authentication.getName();
        User user = authService.getCurrentUser(email);
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().name(),
                "roleDescription", emailValidationService.getRoleDescription(user.getRole()),
                "createdAt", user.getCreatedAt().toString()));
    }
    
    /** Updates the currently authenticated user's profile */
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody Map<String, String> request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        }
        String email = authentication.getName();
        String newName = request.get("name");
        
        try {
            User user = authService.updateProfile(email, newName);
            return ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "role", user.getRole().name(),
                    "roleDescription", emailValidationService.getRoleDescription(user.getRole()),
                    "createdAt", user.getCreatedAt().toString()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Failed to update profile: " + e.getMessage()));
        }
    }

    /** Validates email and returns role assignment if allowed */
    @PostMapping("/validate-email")
    public ResponseEntity<?> validateEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }

        try {
            User.Role role = emailValidationService.validateAndAssignRole(email);
            return ResponseEntity.ok(Map.of(
                    "allowed", true,
                    "role", role.name(),
                    "roleDescription", emailValidationService.getRoleDescription(role),
                    "message", "Email is valid and allowed"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body(Map.of(
                    "allowed", false,
                    "message", e.getMessage()));
        }
    }
}
