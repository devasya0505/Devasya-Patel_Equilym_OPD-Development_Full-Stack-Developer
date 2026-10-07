import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { PatientsComponent } from './components/patients/patients';
import { AppointmentsComponent } from './components/appointments/appointments';
import { ConsultationsComponent } from './components/consultations/consultations';

/**
 * Application Routing Table.
 * 
 * Maps URL paths to our 3 core assignment components + Dashboard:
 * - /patients       → Screen 1: Patient Register & List
 * - /appointments   → Screen 2: Appointment Book & List
 * - /consultations  → Screen 3: Consultation Summary Form & History
 */
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard — EquiCare OPD' },
  { path: 'patients', component: PatientsComponent, title: 'Patients — EquiCare OPD' },
  { path: 'appointments', component: AppointmentsComponent, title: 'Appointments — EquiCare OPD' },
  { path: 'consultations', component: ConsultationsComponent, title: 'Consultations — EquiCare OPD' },
  { path: '**', redirectTo: 'dashboard' }
];
