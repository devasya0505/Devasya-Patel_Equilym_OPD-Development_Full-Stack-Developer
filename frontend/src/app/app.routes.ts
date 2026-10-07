import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { PatientsComponent } from './components/patients/patients';
import { AppointmentsComponent } from './components/appointments/appointments';
import { ConsultationsComponent } from './components/consultations/consultations';
import { LoginComponent } from './components/login/login';
import { authGuard } from './guards/auth.guard';

/**
 * Application Routing Table.
 * 
 * Includes:
 * - /login : Authentication Screen
 * - /dashboard, /patients, /appointments, /consultations : Protected by authGuard
 */
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Login — EquiCare OPD' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard — EquiCare OPD', canActivate: [authGuard] },
  { path: 'patients', component: PatientsComponent, title: 'Patients — EquiCare OPD', canActivate: [authGuard] },
  { path: 'appointments', component: AppointmentsComponent, title: 'Appointments — EquiCare OPD', canActivate: [authGuard] },
  { path: 'consultations', component: ConsultationsComponent, title: 'Consultations — EquiCare OPD', canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' }
];
