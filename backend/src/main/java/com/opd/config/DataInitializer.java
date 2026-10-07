package com.opd.config;

import com.opd.entity.Appointment;
import com.opd.entity.Consultation;
import com.opd.entity.Patient;
import com.opd.repository.AppointmentRepository;
import com.opd.repository.ConsultationRepository;
import com.opd.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * DataInitializer — Seeds the database with realistic initial demo data on application startup.
 * 
 * Implements CommandLineRunner so the run() method executes right after the Spring ApplicationContext is loaded.
 * If the database is already populated, it avoids duplicate insertions.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final ConsultationRepository consultationRepository;

    @Override
    public void run(String... args) {
        // If database already contains patients, do not re-seed
        if (patientRepository.count() > 0) {
            log.info("Database already contains data. Skipping initial seeding.");
            return;
        }

        log.info("Seeding initial OPD demo data...");

        // 1. Create Sample Patients
        Patient p1 = patientRepository.save(Patient.builder()
                .name("Aarav Sharma")
                .gender(Patient.Gender.MALE)
                .age(34)
                .phone("9876543210")
                .build());

        Patient p2 = patientRepository.save(Patient.builder()
                .name("Priya Patel")
                .gender(Patient.Gender.FEMALE)
                .age(28)
                .phone("9823456789")
                .build());

        Patient p3 = patientRepository.save(Patient.builder()
                .name("Rohan Mehta")
                .gender(Patient.Gender.MALE)
                .age(45)
                .phone("9123456780")
                .build());

        Patient p4 = patientRepository.save(Patient.builder()
                .name("Sunita Rao")
                .gender(Patient.Gender.FEMALE)
                .age(52)
                .phone("9988776655")
                .build());

        // 2. Create Sample Appointments for Today & Upcoming
        LocalDate today = LocalDate.now();

        Appointment app1 = appointmentRepository.save(Appointment.builder()
                .patient(p1)
                .doctorName("Dr. Anita Desai (General Physician)")
                .appointmentDate(today)
                .appointmentTime(LocalTime.of(9, 30))
                .status(Appointment.AppointmentStatus.COMPLETED)
                .build());

        Appointment app2 = appointmentRepository.save(Appointment.builder()
                .patient(p2)
                .doctorName("Dr. Rajesh Verma (Cardiologist)")
                .appointmentDate(today)
                .appointmentTime(LocalTime.of(10, 15))
                .status(Appointment.AppointmentStatus.BOOKED)
                .build());

        Appointment app3 = appointmentRepository.save(Appointment.builder()
                .patient(p3)
                .doctorName("Dr. Anita Desai (General Physician)")
                .appointmentDate(today)
                .appointmentTime(LocalTime.of(11, 0))
                .status(Appointment.AppointmentStatus.BOOKED)
                .build());

        Appointment app4 = appointmentRepository.save(Appointment.builder()
                .patient(p4)
                .doctorName("Dr. Vikram Malhotra (Orthopedic)")
                .appointmentDate(today.plusDays(1))
                .appointmentTime(LocalTime.of(14, 0))
                .status(Appointment.AppointmentStatus.BOOKED)
                .build());

        // 3. Create Sample Consultation for Completed Appointment
        consultationRepository.save(Consultation.builder()
                .appointment(app1)
                .bloodPressure("120/80 mmHg")
                .temperature(98.6)
                .notes("Patient reported mild fever and fatigue. Vitals normal. Prescribed Paracetamol 500mg SOS and rest for 2 days.")
                .isCompleted(true)
                .build());

        log.info("OPD Demo Data successfully initialized!");
    }
}
