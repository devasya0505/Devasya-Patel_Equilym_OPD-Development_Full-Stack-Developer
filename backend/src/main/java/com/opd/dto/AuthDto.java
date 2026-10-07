package com.opd.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * Login Request and Response DTOs (Data Transfer Objects).
 * 
 * Separates API request/response contracts from internal entity structures.
 */
public class AuthDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank(message = "Username or Email is required")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LoginResponse {
        private String token;
        private String email;
        private String name;
        private String role; // "DOCTOR" or "RECEPTIONIST"
        private String message;
    }
}
