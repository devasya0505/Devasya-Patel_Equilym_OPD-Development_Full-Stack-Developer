import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { AppointmentService } from '../../services/appointment.service';
import { Patient, Appointment } from '../../models/opd.models';

/**
 * DashboardComponent — Summary and quick-launch dashboard for the OPD module.
 * 
 * Implements OnInit lifecycle hook to fetch dashboard stats on component load.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  private patientService = inject(PatientService);
  private appointmentService = inject(AppointmentService);

  // Dashboard state
  patients: Patient[] = [];
  todayAppointments: Appointment[] = [];
  isLoading = true;

  // Computed metrics
  stats = {
    totalPatients: 0,
    todayTotal: 0,
    todayPending: 0,
    todayCompleted: 0
  };

  ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * Load summary numbers and today's schedule from backend.
   */
  loadDashboardData(): void {
    this.isLoading = true;

    // Load patients count
    this.patientService.getAllPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.stats.totalPatients = data.length;
      },
      error: (err) => console.error('Error loading patients', err)
    });

    // Load today's appointments
    this.appointmentService.getTodaysAppointments().subscribe({
      next: (data) => {
        this.todayAppointments = data;
        this.stats.todayTotal = data.length;
        this.stats.todayCompleted = data.filter(a => a.status === 'COMPLETED').length;
        this.stats.todayPending = data.filter(a => a.status === 'BOOKED').length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading today appointments', err);
        this.isLoading = false;
      }
    });
  }
}
