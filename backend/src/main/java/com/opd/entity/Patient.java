package com.opd.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Patient Entity — Represents a patient registered in the OPD system.
 * 
 * Maps to the 'patients' table in MySQL.
 * Fields: name, gender, age, phone (as per assignment requirement).
 * 
 * @Entity  — Marks this class as a JPA entity (maps to a DB table)
 * @Table   — Specifies the table name in the database
 * @Data    — Lombok: generates getters, setters, toString, equals, hashCode
 */
@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    // Auto-generated primary key using MySQL's AUTO_INCREMENT
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Patient's full name — cannot be blank, max 100 chars
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be under 100 characters")
    @Column(nullable = false)
    private String name;

    // Gender: MALE, FEMALE, OTHER — stored as a string in DB
    @NotNull(message = "Gender is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    // Patient's age — must be between 0 and 150
    @NotNull(message = "Age is required")
    @Min(value = 0, message = "Age cannot be negative")
    @Max(value = 150, message = "Age must be realistic")
    @Column(nullable = false)
    private Integer age;

    // Phone number — validated with regex for 10-15 digit numbers
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone must be 10-15 digits")
    @Column(nullable = false)
    private String phone;

    // Timestamp when patient was registered — auto-set on creation
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /**
     * JPA lifecycle callback — sets the creation timestamp
     * before the entity is first persisted to the database.
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Enum for gender options
    public enum Gender {
        MALE, FEMALE, OTHER
    }
}
