import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { ConsultationService } from '../../services/consultation.service';
import { ToastService } from '../../services/toast.service';
import { Patient, Consultation } from '../../models/opd.models';

/**
 * PatientsComponent — Screen 1: Patient Registration, Patient List, and Real-time Search.
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
  private cdr = inject(ChangeDetectorRef);

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
          this.patients = data || [];
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.toastService.error('Failed to search patients');
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.patientService.getAllPatients().subscribe({
        next: (data) => {
          this.patients = data || [];
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.toastService.error('Failed to load patient records');
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  onSearchChange(): void {
    this.loadPatients();
  }

  openAddModal(): void {
    this.patientForm.reset({
      gender: 'MALE'
    });
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

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
        this.cdr.detectChanges();
      }
    });
  }

  viewPatientHistory(patient: Patient): void {
    this.selectedPatient = patient;
    this.showHistoryModal = true;
    this.isLoadingHistory = true;

    if (patient.id) {
      this.consultationService.getCompletedConsultations(patient.id).subscribe({
        next: (consultations) => {
          this.patientConsultations = consultations || [];
          this.isLoadingHistory = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.toastService.error('Failed to load patient history.');
          this.isLoadingHistory = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  closeHistoryModal(): void {
    this.showHistoryModal = false;
    this.selectedPatient = null;
    this.patientConsultations = [];
  }

  bookAppointmentFor(patient: Patient): void {
    this.router.navigate(['/appointments'], {
      queryParams: { patientId: patient.id }
    });
  }
}
