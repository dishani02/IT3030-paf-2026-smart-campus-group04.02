package com.sliit.smartcampus.service;

/** Core authentication and role assignment service */
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.sliit.smartcampus.config.JwtUtil;
import com.sliit.smartcampus.dto.AuthResponseDTO;
import com.sliit.smartcampus.dto.LoginRequestDTO;
import com.sliit.smartcampus.exception.ResourceNotFoundException;
import com.sliit.smartcampus.model.User;
import com.sliit.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailValidationService emailValidationService;

    @Value("${app.google.client-id}")
    private String googleClientId;

    // ── Email/password login ──────────────────────────────────────────────────

    public AuthResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return new AuthResponseDTO(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    // ── Register new user ─────────────────────────────────────────────────────

    public AuthResponseDTO register(String name, String email, String password) {
        // 1. Validate email domain and get role
        User.Role assignedRole = emailValidationService.validateAndAssignRole(email);

        // 2. Check for duplicate
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalStateException("An account with this email already exists. Please sign in.");
        }

        // 3. Create and save user
        User newUser = new User();
        newUser.setName(name);
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setRole(assignedRole);
        newUser = userRepository.save(newUser);

        // 4. Return JWT so frontend can log the user in immediately
        String token = jwtUtil.generateToken(newUser.getEmail(), newUser.getRole().name(), newUser.getId());
        return new AuthResponseDTO(token, newUser.getId(), newUser.getName(), newUser.getEmail(),
                newUser.getRole().name());
    }

    // ── Google OAuth2 login (ID-token flow) ──────────────────────────────────

    public AuthResponseDTO loginWithGoogle(String idToken) {
        GoogleIdToken.Payload payload = verifyGoogleToken(idToken);

        String email = payload.getEmail();
        String rawName = (String) payload.get("name");
        String name = (rawName == null || rawName.isBlank()) ? email.split("@")[0] : rawName;

        // Validate email and assign role based on institutional patterns
        User.Role assignedRole = emailValidationService.validateAndAssignRole(email);

        // Find existing user or auto-register them with assigned role
        Optional<User> existing = userRepository.findByEmail(email);
        User user = existing.orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            // Assign a random unusable password — Google users never use it
            newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            newUser.setRole(assignedRole);
            return userRepository.save(newUser);
        });

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return new AuthResponseDTO(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    
    // ── Update Profile ─────────────────────────────────────────────────────────

    public User updateProfile(String email, String newName) {
        if (newName == null || newName.trim().isBlank()) {
            throw new IllegalArgumentException("Full name is required");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        user.setName(newName.trim());
        return userRepository.save(user);
    }

    private GoogleIdToken.Payload verifyGoogleToken(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                throw new BadCredentialsException("Invalid Google ID token");
            }
            return idToken.getPayload();
        } catch (BadCredentialsException e) {
            throw e;
        } catch (Exception e) {
            throw new BadCredentialsException("Google token verification failed: " + e.getMessage());
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }
}
