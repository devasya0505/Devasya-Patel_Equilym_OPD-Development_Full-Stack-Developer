package com.opd.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Consultation Entity — Stores the doctor's consultation notes for an appointment.
 * 
 * Contains:
 * - 2 vital fields (blood pressure + temperature) as per assignment
 * - Doctor's clinical notes
 * - Completion status
 * 
 * @OneToOne — Each appointment has exactly ONE consultation record
 */
@Entity
@Table(name = "consultations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Consultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // One-to-one link: each consultation belongs to exactly one appointment
    // CascadeType.MERGE ensures updates propagate to the appointment
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    private Appointment appointment;

    // ---- VITALS (2 fields as required) ----

    // Blood Pressure reading (e.g., "120/80 mmHg")
    @NotBlank(message = "Blood pressure is required")
    @Column(name = "blood_pressure", nullable = false)
    private String bloodPressure;

    // Body Temperature in °F (e.g., 98.6)
    @NotNull(message = "Temperature is required")
    @Column(nullable = false)
    private Double temperature;

    // ---- NOTES ----

    // Doctor's clinical observations and prescription notes
    @Column(columnDefinition = "TEXT")
    private String notes;

    // Whether this consultation has been marked as complete by the doctor
    @Column(name = "is_completed")
    @Builder.Default
    private Boolean isCompleted = false;

    // When the consultation record was created
    @Column(name = "consulted_at")
    private LocalDateTime consultedAt;

    /**
     * Auto-set the consultation timestamp when first saved.
     */
    @PrePersist
    protected void onCreate() {
        this.consultedAt = LocalDateTime.now();
    }
}
