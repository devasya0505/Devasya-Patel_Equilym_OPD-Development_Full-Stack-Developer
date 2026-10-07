package com.opd.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Appointment Entity — Represents a booked OPD appointment.
 * 
 * Links a Patient to a Doctor on a specific date/time.
 * Status tracks the appointment lifecycle: BOOKED → COMPLETED / CANCELLED.
 */
@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Foreign key relationship: many appointments can belong to one patient
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    // Doctor's name
    @NotBlank(message = "Doctor name is required")
    @Column(name = "doctor_name", nullable = false)
    private String doctorName;

    // Appointment date
    @NotNull(message = "Appointment date is required")
    @Column(name = "appointment_date", nullable = false)
    private LocalDate appointmentDate;

    // Appointment time slot
    @NotNull(message = "Appointment time is required")
    @Column(name = "appointment_time", nullable = false)
    private LocalTime appointmentTime;

    // Status: BOOKED (default), COMPLETED, or CANCELLED
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AppointmentStatus status = AppointmentStatus.BOOKED;

    /**
     * JPA lifecycle callback — guarantees status is never null before inserting to DB.
     */
    @PrePersist
    protected void onCreate() {
        if (this.status == null) {
            this.status = AppointmentStatus.BOOKED;
        }
    }

    // Enum for appointment lifecycle states
    public enum AppointmentStatus {
        BOOKED,      // Initial state when appointment is created
        COMPLETED,   // After doctor finishes consultation
        CANCELLED    // If appointment is cancelled
    }
}
