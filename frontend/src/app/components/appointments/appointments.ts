import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { PatientService } from '../../services/patient.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Appointment, Patient } from '../../models/opd.models';

/**
 * AppointmentsComponent — Screen 2: Appointment Booking and Schedule Listing.
 * 
 * Role-Aware Behavior:
 * - When a Doctor is logged in (e.g. Dr. Anita Desai), new bookings automatically default to her profile.
 * - When Receptionist/Admin is logged in, any doctor can be selected from the hospital roster.
 */
@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './appointments.html',
  styleUrls: ['./appointments.css']
})
export class AppointmentsComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private patientService = inject(PatientService);
  authService = inject(AuthService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  doctorsList = [
    'Dr. Anita Desai (General Physician)',
    'Dr. Rajesh Verma (Cardiologist)',
    'Dr. Vikram Malhotra (Orthopedic)',
    'Dr. Sunita Kapoor (Pediatrician)',
    'Dr. Rohit Sengupta (ENT Specialist)'
  ];

  activeTab: 'today' | 'all' = 'today';
  todayAppointments: Appointment[] = [];
  allAppointments: Appointment[] = [];
  patients: Patient[] = [];
  isLoading = false;
  isSubmitting = false;
  showBookModal = false;

  bookingForm: FormGroup = this.fb.group({
    patientId: [null, [Validators.required]],
    doctorName: [this.doctorsList[0], [Validators.required]],
    appointmentDate: [this.getTodayDateString(), [Validators.required]],
    appointmentTime: ['10:00', [Validators.required]]
  });

  ngOnInit(): void {
    this.loadPatientsList();
    this.loadAppointments();

    this.route.queryParams.subscribe(params => {
      if (params['patientId']) {
        const pId = Number(params['patientId']);
        this.bookingForm.patchValue({ patientId: pId });
        this.openBookModal();
        this.cdr.detectChanges();
      }
    });
  }

  getTodayDateString(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  loadPatientsList(): void {
    this.patientService.getAllPatients().subscribe({
      next: (data) => {
        this.patients = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching patients for booking dropdown', err)
    });
  }

  loadAppointments(): void {
    this.isLoading = true;

    this.appointmentService.getTodaysAppointments().subscribe({
      next: (todayData) => {
        this.todayAppointments = todayData || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastService.error('Failed to load today appointments');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });

    this.appointmentService.getAllAppointments().subscribe({
      next: (allData) => {
        this.allAppointments = allData || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading all appointments', err)
    });
  }

  openBookModal(): void {
    this.bookingForm.patchValue({
      doctorName: this.doctorsList[0],
      appointmentDate: this.getTodayDateString(),
      appointmentTime: '10:00'
    });
    this.showBookModal = true;
  }

  closeBookModal(): void {
    this.showBookModal = false;
  }

  submitBooking(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      this.toastService.error('Please fill all appointment details.');
      return;
    }

    this.isSubmitting = true;
    const formVal = this.bookingForm.value;
    const patientId = Number(formVal.patientId);

    let timeVal = formVal.appointmentTime;
    if (timeVal && timeVal.split(':').length === 2) {
      timeVal += ':00';
    }

    const payload: Partial<Appointment> = {
      doctorName: formVal.doctorName,
      appointmentDate: formVal.appointmentDate,
      appointmentTime: timeVal,
      status: 'BOOKED'
    };

    this.appointmentService.bookAppointment(payload, patientId).subscribe({
      next: (savedApp) => {
        this.toastService.success(`Appointment booked with ${savedApp.doctorName} on ${savedApp.appointmentDate}!`);
        this.isSubmitting = false;
        this.closeBookModal();
        this.loadAppointments();
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Failed to book appointment.';
        this.toastService.error(errorMsg);
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  startConsultation(app: Appointment): void {
    this.router.navigate(['/consultations'], {
      queryParams: { appointmentId: app.id }
    });
  }
}
