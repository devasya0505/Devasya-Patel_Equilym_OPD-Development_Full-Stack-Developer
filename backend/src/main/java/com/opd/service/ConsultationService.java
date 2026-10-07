package com.opd.service;

import com.opd.entity.Appointment;
import com.opd.entity.Consultation;
import com.opd.repository.AppointmentRepository;
import com.opd.repository.ConsultationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Consultation Service — Handles doctor consultation logic.
 * 
 * Key responsibilities:
 * 1. Create a consultation (enter vitals + notes for an appointment)
 * 2. Mark consultation as complete (updates appointment status too)
 * 3. View completed consultations for a patient
 * 
 * @Transactional — Ensures DB operations are atomic
 *   (if marking complete fails, the consultation save is rolled back)
 */
@Service
@RequiredArgsConstructor
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final AppointmentRepository appointmentRepository;

    /**
     * Create or save a consultation for an appointment.
     * 
     * Business rules:
     * - The appointment must exist
     * - A consultation must not already exist for this appointment
     * 
     * @param consultation  — The consultation data (vitals, notes)
     * @param appointmentId — The appointment this consultation is for
     */
    @Transactional
    public Consultation createConsultation(Consultation consultation, Long appointmentId) {
        // Verify appointment exists
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + appointmentId));

        // Prevent duplicate consultations for the same appointment
        if (consultationRepository.existsByAppointmentId(appointmentId)) {
            throw new RuntimeException("Consultation already exists for appointment: " + appointmentId);
        }

        // Link consultation to the appointment
        consultation.setAppointment(appointment);

        return consultationRepository.save(consultation);
    }

    /**
     * Mark a consultation as complete.
     * 
     * This is a two-step operation (hence @Transactional):
     * 1. Set consultation.isCompleted = true
     * 2. Update appointment.status = COMPLETED
     * 
     * Both must succeed or both are rolled back.
     */
    @Transactional
    public Consultation markComplete(Long consultationId) {
        // Fetch the consultation
        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Consultation not found with id: " + consultationId));

        // Mark the consultation as complete
        consultation.setIsCompleted(true);

        // Also update the linked appointment's status to COMPLETED
        Appointment appointment = consultation.getAppointment();
        appointment.setStatus(Appointment.AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);

        return consultationRepository.save(consultation);
    }

    /**
     * Get all completed consultations for a specific patient.
     * Used in the "Patient Consultation History" view.
     */
    public List<Consultation> getCompletedConsultations(Long patientId) {
        return consultationRepository.findByAppointmentPatientIdAndIsCompletedTrue(patientId);
    }

    /**
     * Get consultation by appointment ID.
     * Returns null if no consultation exists yet (appointment is still pending).
     */
    public Consultation getConsultationByAppointment(Long appointmentId) {
        return consultationRepository.findByAppointmentId(appointmentId).orElse(null);
    }
}
