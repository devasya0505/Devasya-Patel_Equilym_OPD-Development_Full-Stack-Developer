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
 * 
 * @ManyToOne — Each appointment belongs to ONE patient (many appointments per patient)
 * @JoinColumn — Creates a foreign key 'patient_id' in the appointments table
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
    // FetchType.EAGER = always load patient data with the appointment
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    // Doctor's name — simple string (no separate Doctor entity needed for this demo)
    @NotBlank(message = "Doctor name is required")
    @Column(name = "doctor_name", nullable = false)
    private String doctorName;

    // Appointment date — must be today or in the future
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

    // Enum for appointment lifecycle states
    public enum AppointmentStatus {
        BOOKED,      // Initial state when appointment is created
        COMPLETED,   // After doctor finishes consultation
        CANCELLED    // If appointment is cancelled
    }
}
