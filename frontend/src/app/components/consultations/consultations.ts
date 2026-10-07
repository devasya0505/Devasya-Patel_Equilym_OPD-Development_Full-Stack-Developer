import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultationService } from '../../services/consultation.service';
import { AppointmentService } from '../../services/appointment.service';
import { PatientService } from '../../services/patient.service';
import { ToastService } from '../../services/toast.service';
import { Consultation, Appointment, Patient } from '../../models/opd.models';

/**
 * ConsultationsComponent — Screen 3: Doctor Consultation Summary & Record Management.
 */
@Component({
  selector: 'app-consultations',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './consultations.html',
  styleUrls: ['./consultations.css']
})
export class ConsultationsComponent implements OnInit {
  private consultationService = inject(ConsultationService);
  private appointmentService = inject(AppointmentService);
  private patientService = inject(PatientService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  activeTab: 'form' | 'history' = 'form';
  queueFilter: 'all' | 'today' = 'all';

  allAppointments: Appointment[] = [];
  todayAppointments: Appointment[] = [];
  selectedAppointment: Appointment | null = null;
  existingConsultation: Consultation | null = null;
  isLoadingQueue = true;
  isSaving = false;
  isMarkingComplete = false;

  allPatients: Patient[] = [];
  historyPatientId: number | null = null;
  selectedHistoryPatient: Patient | null = null;
  patientHistoryConsultations: Consultation[] = [];
  isLoadingHistory = false;

  consultationForm: FormGroup = this.fb.group({
    bloodPressure: ['120/80 mmHg', [Validators.required]],
    temperature: [98.6, [Validators.required, Validators.min(90), Validators.max(110)]],
    notes: ['', [Validators.required, Validators.minLength(5)]]
  });

  ngOnInit(): void {
    this.loadAppointmentsAndPatients();

    this.route.queryParams.subscribe(params => {
      if (params['appointmentId']) {
        const apptId = Number(params['appointmentId']);
        this.selectAppointmentById(apptId);
      }
    });
  }

  get displayedQueue(): Appointment[] {
    if (this.queueFilter === 'today') {
      return this.todayAppointments;
    }
    return this.allAppointments;
  }

  loadAppointmentsAndPatients(): void {
    this.isLoadingQueue = true;

    // 1. Load All Appointments
    this.appointmentService.getAllAppointments().subscribe({
      next: (data) => {
        this.allAppointments = data || [];
        this.isLoadingQueue = false;

        // Auto-select pending appointment if none selected
        if (!this.selectedAppointment && this.allAppointments.length > 0) {
          const pending = this.allAppointments.find(a => a.status === 'BOOKED');
          this.selectAppointment(pending || this.allAppointments[0]);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading all appointments', err);
        this.isLoadingQueue = false;
        this.cdr.detectChanges();
      }
    });

    // 2. Load Today's Appointments
    this.appointmentService.getTodaysAppointments().subscribe({
      next: (todayData) => {
        this.todayAppointments = todayData || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading today appointments', err)
    });

    // 3. Load Patients for History
    this.patientService.getAllPatients().subscribe({
      next: (data) => {
        this.allPatients = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading patients for history', err)
    });
  }

  selectAppointmentById(id: number): void {
    this.appointmentService.getAppointmentById(id).subscribe({
      next: (appt) => {
        if (appt) {
          this.selectAppointment(appt);
        }
      },
      error: (err) => console.error('Error fetching appointment by id', err)
    });
  }

  selectAppointment(appt: Appointment): void {
    if (!appt) return;
    this.selectedAppointment = appt;
    this.existingConsultation = null;

    if (appt.id) {
      this.consultationService.getByAppointment(appt.id).subscribe({
        next: (consultation) => {
          this.existingConsultation = consultation || null;
          if (consultation && consultation.bloodPressure) {
            this.consultationForm.patchValue({
              bloodPressure: consultation.bloodPressure,
              temperature: consultation.temperature,
              notes: consultation.notes
            });
          } else {
            this.resetFormDefaults();
          }
          this.cdr.detectChanges();
        },
        error: () => {
          this.existingConsultation = null;
          this.resetFormDefaults();
          this.cdr.detectChanges();
        }
      });
    }
  }

  private resetFormDefaults(): void {
    this.consultationForm.reset({
      bloodPressure: '120/80 mmHg',
      temperature: 98.6,
      notes: ''
    });
  }

  saveConsultation(andComplete = false): void {
    if (!this.selectedAppointment || !this.selectedAppointment.id) {
      this.toastService.error('Please select an appointment first.');
      return;
    }

    if (this.consultationForm.invalid) {
      this.consultationForm.markAllAsTouched();
      this.toastService.error('Please enter valid vitals and doctor notes.');
      return;
    }

    this.isSaving = true;
    const formVal = this.consultationForm.value;

    const payload: Partial<Consultation> = {
      bloodPressure: formVal.bloodPressure,
      temperature: Number(formVal.temperature),
      notes: formVal.notes,
      isCompleted: andComplete
    };

    if (this.existingConsultation && this.existingConsultation.id) {
      if (andComplete) {
        this.markAsCompleted(this.existingConsultation.id);
      } else {
        this.toastService.info('Consultation record is already saved.');
        this.isSaving = false;
        this.cdr.detectChanges();
      }
      return;
    }

    this.consultationService.createConsultation(payload, this.selectedAppointment.id).subscribe({
      next: (saved) => {
        this.existingConsultation = saved;
        this.isSaving = false;

        if (andComplete && saved.id) {
          this.markAsCompleted(saved.id);
        } else {
          this.toastService.success('Consultation draft saved successfully!');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        const msg = err.error?.message || 'Failed to save consultation.';
        this.toastService.error(msg);
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  markAsCompleted(consultationId: number): void {
    this.isMarkingComplete = true;
    this.consultationService.markComplete(consultationId).subscribe({
      next: (completed) => {
        this.existingConsultation = completed;
        if (this.selectedAppointment) {
          this.selectedAppointment.status = 'COMPLETED';
        }
        this.toastService.success('Consultation marked as COMPLETED! Appointment closed.');
        this.isMarkingComplete = false;
        this.loadAppointmentsAndPatients();
      },
      error: (err) => {
        this.toastService.error('Failed to mark consultation as complete.');
        this.isMarkingComplete = false;
        this.cdr.detectChanges();
      }
    });
  }

  onHistoryPatientChange(): void {
    if (!this.historyPatientId) {
      this.selectedHistoryPatient = null;
      this.patientHistoryConsultations = [];
      return;
    }

    const pId = Number(this.historyPatientId);
    this.selectedHistoryPatient = this.allPatients.find(p => p.id === pId) || null;
    this.isLoadingHistory = true;

    this.consultationService.getCompletedConsultations(pId).subscribe({
      next: (consultations) => {
        this.patientHistoryConsultations = consultations || [];
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
