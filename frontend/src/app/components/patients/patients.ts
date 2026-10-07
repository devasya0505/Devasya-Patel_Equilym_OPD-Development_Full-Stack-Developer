import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { ConsultationService } from '../../services/consultation.service';
import { ToastService } from '../../services/toast.service';
import { Patient, Consultation } from '../../models/opd.models';

/**
 * PatientsComponent — Screen 1: Patient Registration, Patient List, and Real-time Search.
 * 
 * Features:
 * 1. Reactive Form with client-side validation (Name, Gender, Age, Phone).
 * 2. Real-time search by Name OR Phone number.
 * 3. Quick modal to view medical history & past consultations for any patient.
 * 4. Direct navigation to Book Appointment for the selected patient.
 */
@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './patients.html',
  styleUrls: ['./patients.css']
})
export class PatientsComponent implements OnInit {
  private patientService = inject(PatientService);
  private consultationService = inject(ConsultationService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // State variables
  patients: Patient[] = [];
  searchKeyword = '';
  isLoading = false;
  isSubmitting = false;
  showAddModal = false;
  showHistoryModal = false;

  // Selected patient for medical history view
  selectedPatient: Patient | null = null;
  patientConsultations: Consultation[] = [];
  isLoadingHistory = false;

  // Reactive Form for Patient Registration
  patientForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    gender: ['MALE', [Validators.required]],
    age: [null, [Validators.required, Validators.min(0), Validators.max(150)]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]]
  });

  ngOnInit(): void {
    this.loadPatients();
  }

  /**
   * Load all patients or search by keyword.
   */
  loadPatients(): void {
    this.isLoading = true;
    if (this.searchKeyword.trim()) {
      this.patientService.searchPatients(this.searchKeyword).subscribe({
        next: (data) => {
          this.patients = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.toastService.error('Failed to search patients');
          this.isLoading = false;
        }
      });
    } else {
      this.patientService.getAllPatients().subscribe({
        next: (data) => {
          this.patients = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.toastService.error('Failed to load patient records');
          this.isLoading = false;
        }
      });
    }
  }

  /**
   * Triggered on search input change.
   */
  onSearchChange(): void {
    this.loadPatients();
  }

  /**
   * Open the Patient Registration Modal.
   */
  openAddModal(): void {
    this.patientForm.reset({
      gender: 'MALE'
    });
    this.showAddModal = true;
  }

  /**
   * Close the Patient Registration Modal.
   */
  closeAddModal(): void {
    this.showAddModal = false;
  }

  /**
   * Submit the Patient Registration Form to Spring Boot backend.
   */
  submitPatient(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      this.toastService.error('Please fill all required fields correctly.');
      return;
    }

    this.isSubmitting = true;
    const newPatient: Patient = this.patientForm.value;

    this.patientService.registerPatient(newPatient).subscribe({
      next: (savedPatient) => {
        this.toastService.success(`Patient "${savedPatient.name}" registered successfully! (ID: #PID-${savedPatient.id})`);
        this.isSubmitting = false;
        this.closeAddModal();
        this.loadPatients();
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Failed to register patient.';
        this.toastService.error(errorMsg);
        this.isSubmitting = false;
      }
    });
  }

  /**
   * View past completed consultations for a patient.
   */
  viewPatientHistory(patient: Patient): void {
    this.selectedPatient = patient;
    this.showHistoryModal = true;
    this.isLoadingHistory = true;

    if (patient.id) {
      this.consultationService.getCompletedConsultations(patient.id).subscribe({
        next: (consultations) => {
          this.patientConsultations = consultations;
          this.isLoadingHistory = false;
        },
        error: (err) => {
          this.toastService.error('Failed to load patient history.');
          this.isLoadingHistory = false;
        }
      });
    }
  }

  /**
   * Close the Patient Medical History Modal.
   */
  closeHistoryModal(): void {
    this.showHistoryModal = false;
    this.selectedPatient = null;
    this.patientConsultations = [];
  }

  /**
   * Quick action: Navigate directly to book appointment with this patient pre-selected.
   */
  bookAppointmentFor(patient: Patient): void {
    this.router.navigate(['/appointments'], {
      queryParams: { patientId: patient.id }
    });
  }
}
