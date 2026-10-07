package com.opd.controller;

import com.opd.dto.AuthDto;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

/**
 * Auth Controller — Basic Authentication Endpoints.
 * 
 * Provides:
 * - POST /api/auth/login : Authenticates user credentials and returns session token + profile
 * - GET  /api/auth/demo-users : Provides quick demo accounts for review/testing
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    /**
     * Authenticate user credentials.
     * 
     * Supported Demo Credentials:
     * 1. Doctor:       doctor@equicare.com   / doctor123
     * 2. Receptionist: reception@equicare.com / reception123
     * 3. Admin:        admin@equicare.com     / admin123
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthDto.LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String password = request.getPassword().trim();

        // 1. Doctor Account
        if (("doctor@equicare.com".equals(email) || "doctor".equals(email)) && "doctor123".equals(password)) {
            return ResponseEntity.ok(AuthDto.LoginResponse.builder()
                    .token("JWT-DEMO-" + UUID.randomUUID())
                    .email("doctor@equicare.com")
                    .name("Dr. Anita Desai")
                    .role("DOCTOR")
                    .message("Login successful! Welcome Dr. Anita Desai.")
                    .build());
        }

        // 2. Receptionist Account
        if (("reception@equicare.com".equals(email) || "reception".equals(email)) && "reception123".equals(password)) {
            return ResponseEntity.ok(AuthDto.LoginResponse.builder()
                    .token("JWT-DEMO-" + UUID.randomUUID())
                    .email("reception@equicare.com")
                    .name("Pooja Sharma")
                    .role("RECEPTIONIST")
                    .message("Login successful! Welcome Pooja.")
                    .build());
        }

        // 3. Admin Account
        if (("admin@equicare.com".equals(email) || "admin".equals(email)) && "admin123".equals(password)) {
            return ResponseEntity.ok(AuthDto.LoginResponse.builder()
                    .token("JWT-DEMO-" + UUID.randomUUID())
                    .email("admin@equicare.com")
                    .name("EquiCare Admin")
                    .role("ADMIN")
                    .message("Login successful! Welcome Admin.")
                    .build());
        }

        // Invalid Credentials Response
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                        "status", HttpStatus.UNAUTHORIZED.value(),
                        "message", "Invalid email or password. Please try doctor@equicare.com / doctor123."
                ));
    }
}
