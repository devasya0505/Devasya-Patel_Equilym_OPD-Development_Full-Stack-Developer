package com.opd.repository;

import com.opd.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Patient Repository — Data access layer for Patient entity.
 * 
 * Extends JpaRepository which provides CRUD operations out-of-the-box:
 * - save(), findById(), findAll(), deleteById(), etc.
 * 
 * Spring Data JPA auto-generates the SQL queries from method names!
 * For example: findByNameContainingIgnoreCase("john") →
 *   SELECT * FROM patients WHERE LOWER(name) LIKE '%john%'
 */
@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    /**
     * Search patients by name (case-insensitive, partial match).
     * 'Containing' = SQL LIKE '%value%'
     * 'IgnoreCase' = case-insensitive comparison
     */
    List<Patient> findByNameContainingIgnoreCase(String name);

    /**
     * Search patients by phone number (partial match).
     * Useful for searching by last 4 digits, etc.
     */
    List<Patient> findByPhoneContaining(String phone);

    /**
     * Combined search: find by name OR phone (case-insensitive for name).
     * This is the main search method used by the UI search bar.
     */
    List<Patient> findByNameContainingIgnoreCaseOrPhoneContaining(String name, String phone);
}
