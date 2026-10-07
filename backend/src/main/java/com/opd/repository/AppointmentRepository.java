package com.opd.repository;

import com.opd.entity.Appointment;
import com.opd.entity.Appointment.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

/**
 * Appointment Repository — Data access for Appointment entity.
 * 
 * Key queries:
 * - Find today's appointments (for the "Today's Queue" view)
 * - Find appointments by patient (for patient history)
 * - Find by status (to filter BOOKED vs COMPLETED)
 */
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    /**
     * Get all appointments for a specific date (e.g., today).
     * Used for the "Today's Appointments" dashboard view.
     */
    List<Appointment> findByAppointmentDateOrderByAppointmentTimeAsc(LocalDate date);

    /**
     * Get all appointments for a specific patient.
     * Used to show appointment history on patient's profile.
     */
    List<Appointment> findByPatientIdOrderByAppointmentDateDesc(Long patientId);

    /**
     * Get appointments filtered by both date and status.
     * E.g., today's BOOKED appointments (pending queue).
     */
    List<Appointment> findByAppointmentDateAndStatus(LocalDate date, AppointmentStatus status);
}
