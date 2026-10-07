import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/opd.models';

/**
 * AppointmentService — Interacts with Spring Boot Appointment endpoints.
 */
@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly apiUrl = 'http://localhost:8080/api/appointments';
  private http = inject(HttpClient);

  /**
   * Book an appointment for a patient.
   * Calls: POST /api/appointments?patientId=...
   */
  bookAppointment(appointment: Partial<Appointment>, patientId: number): Observable<Appointment> {
    const params = new HttpParams().set('patientId', patientId.toString());
    return this.http.post<Appointment>(this.apiUrl, appointment, { params });
  }

  /**
   * Get all appointments for today (Queue view).
   * Calls: GET /api/appointments/today
   */
  getTodaysAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/today`);
  }

  /**
   * Get all appointments across all dates.
   * Calls: GET /api/appointments
   */
  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  /**
   * Get all appointments for a specific patient.
   */
  getAppointmentsByPatient(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  /**
   * Get single appointment by ID.
   */
  getAppointmentById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }
}
