package com.opd.service;

import com.opd.entity.Patient;
import com.opd.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Patient Service — Business logic for patient operations.
 * 
 * This layer sits between Controller and Repository.
 * Why? Separation of concerns:
 *   Controller → handles HTTP requests/responses
 *   Service    → contains business rules and logic
 *   Repository → handles database operations
 * 
 * @Service — Marks this as a Spring-managed service bean
 * @RequiredArgsConstructor — Lombok: generates constructor for 'final' fields (dependency injection)
 */
@Service
@RequiredArgsConstructor
public class PatientService {

    // Injected by Spring via constructor injection (best practice over @Autowired)
    private final PatientRepository patientRepository;

    /**
     * Register a new patient.
     * Validation is handled by @Valid in the controller layer.
     */
    public Patient registerPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    /**
     * Get all registered patients, ordered by most recent first.
     */
    public List<Patient> getAllPatients() {
        // findAll() returns all records from the patients table
        return patientRepository.findAll();
    }

    /**
     * Find a specific patient by their ID.
     * Throws RuntimeException if patient doesn't exist — keeps it simple for demo.
     */
    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));
    }

    /**
     * Search patients by name or phone number.
     * The same search term is matched against BOTH fields (OR condition).
     * This powers the search bar in the UI.
     */
    public List<Patient> searchPatients(String keyword) {
        // If no keyword provided, return all patients
        if (keyword == null || keyword.trim().isEmpty()) {
            return patientRepository.findAll();
        }
        // Search in both name (case-insensitive) and phone fields
        return patientRepository.findByNameContainingIgnoreCaseOrPhoneContaining(
                keyword.trim(), keyword.trim());
    }
}
