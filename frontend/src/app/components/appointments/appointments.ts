import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { PatientService } from '../../services/patient.service';
import { ToastService } from '../../services/toast.service';
import { Appointment, Patient } from '../../models/opd.models';

/**
 * AppointmentsComponent — Screen 2: Appointment Booking and Schedule Listing.
 * 
 * Features:
 * 1. Book appointment with patient selector, doctor selector, date picker, and time slot.
 * 2. Tab 1: "Today's Appointments" (OPD Queue with status indicators).
 * 3. Tab 2: "All Appointments" (Historical and upcoming appointments).
 * 4. One-click "Start Consultation" navigation.
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
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Available doctors list for dropdown selection
  doctorsList = [
    'Dr. Anita Desai (General Physician)',
    'Dr. Rajesh Verma (Cardiologist)',
    'Dr. Vikram Malhotra (Orthopedic)',
    'Dr. Sunita Kapoor (Pediatrician)',
    'Dr. Rohit Sengupta (ENT Specialist)'
  ];

  // State variables
  activeTab: 'today' | 'all' = 'today';
  todayAppointments: Appointment[] = [];
  allAppointments: Appointment[] = [];
  patients: Patient[] = [];
  isLoading = false;
  isSubmitting = false;
  showBookModal = false;

  // Appointment Booking Form
  bookingForm: FormGroup = this.fb.group({
    patientId: [null, [Validators.required]],
    doctorName: [this.doctorsList[0], [Validators.required]],
    appointmentDate: [this.getTodayDateString(), [Validators.required]],
    appointmentTime: ['10:00', [Validators.required]]
  });

  ngOnInit(): void {
    this.loadPatientsList();
    this.loadAppointments();

    // Check if a patient was passed via route queryParams (e.g. ?patientId=2)
    this.route.queryParams.subscribe(params => {
      if (params['patientId']) {
        const pId = Number(params['patientId']);
        this.bookingForm.patchValue({ patientId: pId });
        this.showBookModal = true;
      }
    });
  }

  /**
   * Helper to format today's date as YYYY-MM-DD for the HTML date picker.
   */
  getTodayDateString(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  /**
   * Load registered patients to populate the dropdown in booking modal.
   */
  loadPatientsList(): void {
    this.patientService.getAllPatients().subscribe({
      next: (data) => {
        this.patients = data;
      },
      error: (err) => console.error('Error fetching patients for booking dropdown', err)
    });
  }

  /**
   * Load today's schedule and all appointments.
   */
  loadAppointments(): void {
    this.isLoading = true;

    // Fetch Today's Queue
    this.appointmentService.getTodaysAppointments().subscribe({
      next: (todayData) => {
        this.todayAppointments = todayData;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastService.error('Failed to load today appointments');
        this.isLoading = false;
      }
    });

    // Fetch All Appointments
    this.appointmentService.getAllAppointments().subscribe({
      next: (allData) => {
        this.allAppointments = allData;
      },
      error: (err) => console.error('Error loading all appointments', err)
    });
  }

  /**
   * Open the appointment booking modal.
   */
  openBookModal(): void {
    this.bookingForm.patchValue({
      doctorName: this.doctorsList[0],
      appointmentDate: this.getTodayDateString(),
      appointmentTime: '10:00'
    });
    this.showBookModal = true;
  }

  /**
   * Close the booking modal.
   */
  closeBookModal(): void {
    this.showBookModal = false;
  }

  /**
   * Submit the new appointment booking.
   */
  submitBooking(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      this.toastService.error('Please fill all appointment details.');
      return;
    }

    this.isSubmitting = true;
    const formVal = this.bookingForm.value;
    const patientId = Number(formVal.patientId);

    // Format appointment time properly as HH:mm:00
    let timeVal = formVal.appointmentTime;
    if (timeVal && timeVal.split(':').length === 2) {
      timeVal += ':00';
    }

    const payload: Partial<Appointment> = {
      doctorName: formVal.doctorName,
      appointmentDate: formVal.appointmentDate,
      appointmentTime: timeVal
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
      }
    });
  }

  /**
   * Direct navigation to the Consultation room for this appointment.
   */
  startConsultation(app: Appointment): void {
    this.router.navigate(['/consultations'], {
      queryParams: { appointmentId: app.id }
    });
  }
}
