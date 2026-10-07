package com.opd.controller;

import com.opd.entity.Appointment;
import com.opd.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Appointment Controller — REST API for appointment booking and listing.
 * 
 * Base URL: /api/appointments
 * 
 * Endpoints:
 *   POST   /api/appointments?patientId=1    → Book an appointment
 *   GET    /api/appointments                → List all appointments
 *   GET    /api/appointments/today           → List today's appointments
 *   GET    /api/appointments/{id}            → Get appointment by ID
 *   GET    /api/appointments/patient/{patientId} → Get patient's appointments
 */
@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    /**
     * POST /api/appointments?patientId=1 — Book a new appointment.
     * 
     * The patientId comes as a query parameter (not in the body)
     * because the appointment body already contains doctor, date, time.
     * 
     * @RequestParam patientId — Which patient this appointment is for
     * @RequestBody appointment — Doctor name, date, time
     * @return 201 Created with saved appointment
     */
    @PostMapping
    public ResponseEntity<Appointment> bookAppointment(
            @Valid @RequestBody Appointment appointment,
            @RequestParam Long patientId) {
        Appointment saved = appointmentService.bookAppointment(appointment, patientId);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    /**
     * GET /api/appointments — Get all appointments.
     */
    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    /**
     * GET /api/appointments/today — Get today's appointments.
     * This is the "queue" view used at the reception desk.
     * Sorted by appointment time ascending (earliest first).
     */
    @GetMapping("/today")
    public ResponseEntity<List<Appointment>> getTodaysAppointments() {
        return ResponseEntity.ok(appointmentService.getTodaysAppointments());
    }

    /**
     * GET /api/appointments/{id} — Get a single appointment.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    /**
     * GET /api/appointments/patient/{patientId} — Get all appointments for a patient.
     * Used to show appointment history on a patient's profile.
     */
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getPatientAppointments(@PathVariable Long patientId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(patientId));
    }
}
