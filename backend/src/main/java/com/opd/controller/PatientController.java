package com.opd.controller;

import com.opd.entity.Patient;
import com.opd.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Patient Controller — REST API endpoints for patient operations.
 * 
 * Base URL: /api/patients
 * 
 * Endpoints:
 *   POST   /api/patients          → Register a new patient
 *   GET    /api/patients          → List all patients
 *   GET    /api/patients/{id}     → Get patient by ID
 *   GET    /api/patients/search?keyword=...  → Search by name or phone
 * 
 * @RestController — Combines @Controller + @ResponseBody
 *   (all methods return JSON automatically, no need for view templates)
 * @RequestMapping — Sets the base URL prefix for all endpoints in this controller
 * @CrossOrigin — Allows requests from Angular dev server (localhost:4200)
 */
@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    /**
     * POST /api/patients — Register a new patient.
     * 
     * @Valid triggers Bean Validation on the Patient entity
     * (checks @NotBlank, @Size, @Pattern, etc.)
     * If validation fails, Spring returns 400 Bad Request automatically.
     * 
     * @RequestBody — Deserializes the JSON request body into a Patient object
     * @return 201 Created with the saved patient data
     */
    @PostMapping
    public ResponseEntity<Patient> registerPatient(@Valid @RequestBody Patient patient) {
        Patient saved = patientService.registerPatient(patient);
        // Return 201 CREATED status (not 200 OK) because a new resource was created
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    /**
     * GET /api/patients — Get all patients.
     * 
     * @return 200 OK with list of all patients
     */
    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    /**
     * GET /api/patients/{id} — Get a specific patient by ID.
     * 
     * @PathVariable — Extracts the {id} from the URL path
     * @return 200 OK with the patient data
     */
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    /**
     * GET /api/patients/search?keyword=john — Search patients.
     * 
     * @RequestParam — Extracts query parameter from URL
     * Searches in both name (case-insensitive) and phone number fields.
     * 
     * Example: /api/patients/search?keyword=9876
     *   → finds patients whose name or phone contains "9876"
     */
    @GetMapping("/search")
    public ResponseEntity<List<Patient>> searchPatients(
            @RequestParam(defaultValue = "") String keyword) {
        return ResponseEntity.ok(patientService.searchPatients(keyword));
    }
}
