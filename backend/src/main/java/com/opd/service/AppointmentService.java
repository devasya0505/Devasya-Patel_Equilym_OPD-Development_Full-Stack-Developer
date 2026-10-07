package com.opd.service;

import com.opd.entity.Appointment;
import com.opd.entity.Patient;
import com.opd.repository.AppointmentRepository;
import com.opd.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

/**
 * Appointment Service — Handles appointment booking and retrieval logic.
 * 
 * Key responsibilities:
 * 1. Book a new appointment (link patient + doctor + date/time)
 * 2. Get today's appointments (for the reception desk view)
 * 3. Get appointments by patient (for history)
 */
@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;

    /**
     * Book a new appointment.
     * 
     * Flow:
     * 1. Verify the patient exists (throw error if not)
     * 2. Set the patient reference on the appointment
     * 3. Default status is BOOKED (set in entity @Builder.Default)
     * 4. Save to database
     * 
     * @param appointment — The appointment data from the request
     * @param patientId   — The patient this appointment is for
     */
    public Appointment bookAppointment(Appointment appointment, Long patientId) {
        // Fetch the patient — ensures the patient exists before booking
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + patientId));

        // Link the appointment to the patient
        appointment.setPatient(patient);
        
        // Ensure status is initialized to BOOKED
        if (appointment.getStatus() == null) {
            appointment.setStatus(Appointment.AppointmentStatus.BOOKED);
        }

        return appointmentRepository.save(appointment);
    }

    /**
     * Get all appointments for today, sorted by time.
     * This is the main "queue" view for the reception desk.
     */
    public List<Appointment> getTodaysAppointments() {
        return appointmentRepository.findByAppointmentDateOrderByAppointmentTimeAsc(LocalDate.now());
    }

    /**
     * Get all appointments (across all dates).
     * Used for admin/overview purposes.
     */
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    /**
     * Get a single appointment by ID.
     */
    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
    }

    /**
     * Get all appointments for a specific patient.
     * Sorted by date descending (most recent first).
     */
    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientIdOrderByAppointmentDateDesc(patientId);
    }
}
