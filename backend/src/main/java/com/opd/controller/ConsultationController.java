package com.opd.controller;

import com.opd.entity.Consultation;
import com.opd.service.ConsultationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Consultation Controller — REST API for doctor consultations.
 * 
 * Base URL: /api/consultations
 * 
 * Endpoints:
 *   POST   /api/consultations?appointmentId=1       → Create consultation
 *   PUT    /api/consultations/{id}/complete          → Mark as complete
 *   GET    /api/consultations/patient/{patientId}    → Get completed consultations
 *   GET    /api/consultations/appointment/{appointmentId} → Get by appointment
 */
@RestController
@RequestMapping("/api/consultations")
@RequiredArgsConstructor
public class ConsultationController {

    private final ConsultationService consultationService;

    /**
     * POST /api/consultations?appointmentId=1 — Create a consultation.
     * 
     * Doctor fills in: blood pressure, temperature, notes.
     * The appointmentId links this consultation to the correct appointment.
     * 
     * @return 201 Created with the saved consultation
     */
    @PostMapping
    public ResponseEntity<Consultation> createConsultation(
            @Valid @RequestBody Consultation consultation,
            @RequestParam Long appointmentId) {
        Consultation saved = consultationService.createConsultation(consultation, appointmentId);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    /**
     * PUT /api/consultations/{id}/complete — Mark consultation as complete.
     * 
     * PUT is used instead of POST because we're UPDATING an existing resource.
     * This also updates the appointment status to COMPLETED.
     * 
     * @return 200 OK with the updated consultation
     */
    @PutMapping("/{id}/complete")
    public ResponseEntity<Consultation> markComplete(@PathVariable Long id) {
        return ResponseEntity.ok(consultationService.markComplete(id));
    }

    /**
     * GET /api/consultations/patient/{patientId} — Completed consultations for a patient.
     * 
     * Shows the patient's consultation history (only completed ones).
     * Used in the "Patient History" view.
     */
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Consultation>> getCompletedConsultations(@PathVariable Long patientId) {
        return ResponseEntity.ok(consultationService.getCompletedConsultations(patientId));
    }

    /**
     * GET /api/consultations/appointment/{appointmentId} — Get consultation for an appointment.
     * 
     * Returns the consultation if it exists, or 404 if not yet created.
     */
    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<Consultation> getByAppointment(@PathVariable Long appointmentId) {
        Consultation consultation = consultationService.getConsultationByAppointment(appointmentId);
        if (consultation == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(consultation);
    }
}
