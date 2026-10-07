package com.opd.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Global Exception Handler — Catches exceptions across ALL controllers.
 * 
 * Without this, Spring returns ugly stack traces to the client.
 * This converts exceptions into clean, structured JSON error responses.
 * 
 * @RestControllerAdvice — Applies to all @RestController classes
 *   (combination of @ControllerAdvice + @ResponseBody)
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle validation errors (triggered by @Valid on controller methods).
     * 
     * When a field fails validation (e.g., blank name, invalid phone),
     * Spring throws MethodArgumentNotValidException.
     * We catch it and return a map of field → error message.
     * 
     * Example response:
     * {
     *   "name": "Name is required",
     *   "phone": "Phone must be 10-15 digits"
     * }
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        // Extract each field error and build a readable map
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            errors.put(fieldName, message);
        });

        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle RuntimeExceptions (our custom "not found" errors, etc.).
     * 
     * Returns a structured JSON error response instead of a raw stack trace.
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now().toString());
        error.put("message", ex.getMessage());
        error.put("status", HttpStatus.BAD_REQUEST.value());

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
}
