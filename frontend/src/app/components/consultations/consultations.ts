import { Component, OnInit, inject } from '@angular/core';
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
 * 
 * Flow:
 * 1. Doctor selects an appointment (or arrives with ?appointmentId from queue).
 * 2. Enters 2 Vitals (Blood Pressure + Temperature) & Doctor's Clinical Notes.
 * 3. Saves consultation and marks as Complete.
 * 4. Tab 2 allows viewing all historical completed consultations for any patient.
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

  // Tab state: 'form' (Live consultation entry) vs 'history' (Patient historical records)
  activeTab: 'form' | 'history' = 'form';

  // Appointment & Consultation state
  allAppointments: Appointment[] = [];
  selectedAppointment: Appointment | null = null;
  existingConsultation: Consultation | null = null;
  isSaving = false;
  isMarkingComplete = false;

  // History tab state
  allPatients: Patient[] = [];
  historyPatientId: number | null = null;
  selectedHistoryPatient: Patient | null = null;
  patientHistoryConsultations: Consultation[] = [];
  isLoadingHistory = false;

  // Reactive Form for Consultation Entry
  consultationForm: FormGroup = this.fb.group({
    bloodPressure: ['120/80 mmHg', [Validators.required]],
    temperature: [98.6, [Validators.required, Validators.min(90), Validators.max(110)]],
    notes: ['', [Validators.required, Validators.minLength(5)]]
  });

  ngOnInit(): void {
    this.loadAppointmentsAndPatients();

    // Check if an appointment was specified via URL query params
    this.route.queryParams.subscribe(params => {
      if (params['appointmentId']) {
        const apptId = Number(params['appointmentId']);
        this.selectAppointmentById(apptId);
      }
    });
  }

  /**
   * Load data needed for dropdown selectors.
   */
  loadAppointmentsAndPatients(): void {
    // Load all appointments
    this.appointmentService.getAllAppointments().subscribe({
      next: (data) => {
        this.allAppointments = data;
        // If no appointment is selected yet and we have appointments, select the first pending one
        if (!this.selectedAppointment && data.length > 0) {
          const pending = data.find(a => a.status === 'BOOKED');
          if (pending) {
            this.selectAppointment(pending);
          } else {
            this.selectAppointment(data[0]);
          }
        }
      },
      error: (err) => console.error('Error loading appointments', err)
    });

    // Load patients for history lookup
    this.patientService.getAllPatients().subscribe({
      next: (data) => {
        this.allPatients = data;
      },
      error: (err) => console.error('Error loading patients', err)
    });
  }

  /**
   * Select an appointment by its ID.
   */
  selectAppointmentById(id: number): void {
    this.appointmentService.getAppointmentById(id).subscribe({
      next: (appt) => {
        this.selectAppointment(appt);
      },
      error: (err) => console.error('Error fetching appointment by id', err)
    });
  }

  /**
   * Handler when doctor chooses an appointment to consult.
   */
  selectAppointment(appt: Appointment): void {
    this.selectedAppointment = appt;
    this.existingConsultation = null;

    // Check if consultation already exists for this appointment
    if (appt.id) {
      this.consultationService.getByAppointment(appt.id).subscribe({
        next: (consultation) => {
          this.existingConsultation = consultation;
          if (consultation) {
            // Populate form with saved data
            this.consultationForm.patchValue({
              bloodPressure: consultation.bloodPressure,
              temperature: consultation.temperature,
              notes: consultation.notes
            });
          }
        },
        error: () => {
          // No consultation created yet: reset to defaults
          this.existingConsultation = null;
          this.consultationForm.reset({
            bloodPressure: '120/80 mmHg',
            temperature: 98.6,
            notes: ''
          });
        }
      });
    }
  }

  /**
   * Save doctor consultation (vitals + notes).
   */
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

    // If consultation already exists, handle completion directly
    if (this.existingConsultation && this.existingConsultation.id) {
      if (andComplete) {
        this.markAsCompleted(this.existingConsultation.id);
      } else {
        this.toastService.info('Consultation record is already saved.');
        this.isSaving = false;
      }
      return;
    }

    // Create new consultation
    this.consultationService.createConsultation(payload, this.selectedAppointment.id).subscribe({
      next: (saved) => {
        this.existingConsultation = saved;
        this.isSaving = false;

        if (andComplete && saved.id) {
          this.markAsCompleted(saved.id);
        } else {
          this.toastService.success('Consultation draft saved successfully!');
        }
      },
      error: (err) => {
        const msg = err.error?.message || 'Failed to save consultation.';
        this.toastService.error(msg);
        this.isSaving = false;
      }
    });
  }

  /**
   * Mark consultation as complete (triggers backend PUT /complete).
   */
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
      }
    });
  }

  /**
   * On Patient selection in History Tab, fetch completed consultations for that patient.
   */
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
        this.patientHistoryConsultations = consultations;
        this.isLoadingHistory = false;
      },
      error: (err) => {
        this.toastService.error('Failed to load patient history.');
        this.isLoadingHistory = false;
      }
    });
  }
}
