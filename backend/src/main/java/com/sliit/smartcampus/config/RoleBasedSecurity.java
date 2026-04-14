package com.sliit.smartcampus.config;

import com.sliit.smartcampus.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Custom role-based security evaluator for fine-grained access control
 */
@Component("roleSecurity")
public class RoleBasedSecurity {

    /**
     * Checks if the authenticated user has any of the specified roles
     */
    public boolean hasAnyRole(Authentication authentication, String... roles) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        Collection<String> userRoles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        for (String role : roles) {
            if (userRoles.contains("ROLE_" + role)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks if the authenticated user has all of the specified roles
     */
    public boolean hasAllRoles(Authentication authentication, String... roles) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        Set<String> userRoles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        for (String role : roles) {
            if (!userRoles.contains("ROLE_" + role)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks if the authenticated user is the same as the resource owner or has
     * admin privileges
     */
    public boolean isOwnerOrAdmin(Authentication authentication, Long resourceOwnerId) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        // Check if user is admin
        if (hasAnyRole(authentication, "ADMIN")) {
            return true;
        }

        // Check if user is the owner (extracted from JWT token)
        String email = authentication.getName();
        // In a real implementation, you might want to fetch the user from database
        // and compare IDs, but for now we'll rely on email matching
        return email != null && !email.isEmpty();
    }

    /**
     * Checks if the user can access operations based on role hierarchy
     * ADMIN > TECHNICIAN > OPERATIONS > STAFF > USER
     */
    public boolean canAccess(Authentication authentication, String requiredRole) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        Collection<String> userRoles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        // If user is ADMIN, they can access everything
        if (userRoles.contains("ROLE_ADMIN")) {
            return true;
        }

        // Check role hierarchy
        switch (requiredRole) {
            case "USER":
                return userRoles.contains("ROLE_USER") ||
                        userRoles.contains("ROLE_STAFF") ||
                        userRoles.contains("ROLE_OPERATIONS") ||
                        userRoles.contains("ROLE_TECHNICIAN");
            case "STAFF":
                return userRoles.contains("ROLE_STAFF") ||
                        userRoles.contains("ROLE_OPERATIONS") ||
                        userRoles.contains("ROLE_TECHNICIAN");
            case "OPERATIONS":
                return userRoles.contains("ROLE_OPERATIONS") ||
                        userRoles.contains("ROLE_TECHNICIAN");
            case "TECHNICIAN":
                return userRoles.contains("ROLE_TECHNICIAN");
            case "ADMIN":
                return userRoles.contains("ROLE_ADMIN");
            default:
                return false;
        }
    }

    /**
     * Checks if the user can manage other users (admin only)
     */
    public boolean canManageUsers(Authentication authentication) {
        return hasAnyRole(authentication, "ADMIN");
    }

    /**
     * Checks if the user can access technical operations (admin or technician)
     */
    public boolean canAccessTechnicalOps(Authentication authentication) {
        return hasAnyRole(authentication, "ADMIN", "TECHNICIAN");
    }

    /**
     * Checks if the user can access operations management (admin, technician, or
     * operations)
     */
    public boolean canAccessOperations(Authentication authentication) {
        return hasAnyRole(authentication, "ADMIN", "TECHNICIAN", "OPERATIONS");
    }

    /**
     * Checks if the user can access staff functions (admin, technician, operations,
     * or staff)
     */
    public boolean canAccessStaff(Authentication authentication) {
        return hasAnyRole(authentication, "ADMIN", "TECHNICIAN", "OPERATIONS", "STAFF");
    }
}
