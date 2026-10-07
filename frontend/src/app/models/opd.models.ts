/**
 * TypeScript Data Models for OPD System.
 * 
 * TypeScript interfaces provide compile-time type safety.
 * They match the JSON structures returned by our Spring Boot backend.
 */

export interface Patient {
  id?: number;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  age: number;
  phone: string;
  createdAt?: string;
}

export type AppointmentStatus = 'BOOKED' | 'COMPLETED' | 'CANCELLED';

export interface Appointment {
  id?: number;
  patient: Patient;
  doctorName: string;
  appointmentDate: string; // ISO date 'YYYY-MM-DD'
  appointmentTime: string; // 'HH:mm:ss' or 'HH:mm'
  status?: AppointmentStatus;
}

export interface Consultation {
  id?: number;
  appointment: Appointment;
  bloodPressure: string;
  temperature: number;
  notes: string;
  isCompleted?: boolean;
  consultedAt?: string;
}

export interface QuickStats {
  totalPatients: number;
  todayAppointments: number;
  pendingAppointments: number;
  completedConsultations: number;
}
