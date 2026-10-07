package com.opd.repository;

import com.opd.entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Consultation Repository — Data access for Consultation entity.
 * 
 * Key queries:
 * - Find consultation by appointment ID (1:1 relationship)
 * - Find completed consultations for a patient (via appointment's patient)
 */
@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

    /**
     * Find the consultation record for a specific appointment.
     * Returns Optional because a consultation may not exist yet.
     */
    Optional<Consultation> findByAppointmentId(Long appointmentId);

    /**
     * Find all completed consultations for a specific patient.
     * Navigates through the appointment → patient relationship.
     * 'IsCompleted = true' filters only finished consultations.
     */
    List<Consultation> findByAppointmentPatientIdAndIsCompletedTrue(Long patientId);

    /**
     * Check if a consultation already exists for an appointment.
     * Prevents duplicate consultation entries.
     */
    boolean existsByAppointmentId(Long appointmentId);
}
