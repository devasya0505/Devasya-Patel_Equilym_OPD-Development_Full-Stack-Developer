import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consultation } from '../models/opd.models';

/**
 * ConsultationService — Interacts with Spring Boot Consultation endpoints.
 */
@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  private readonly apiUrl = 'http://localhost:8080/api/consultations';
  private http = inject(HttpClient);

  /**
   * Save doctor consultation record (vitals + clinical notes) for an appointment.
   * Calls: POST /api/consultations?appointmentId=...
   */
  createConsultation(consultation: Partial<Consultation>, appointmentId: number): Observable<Consultation> {
    const params = new HttpParams().set('appointmentId', appointmentId.toString());
    return this.http.post<Consultation>(this.apiUrl, consultation, { params });
  }

  /**
   * Mark consultation as complete.
   * Calls: PUT /api/consultations/{id}/complete
   */
  markComplete(consultationId: number): Observable<Consultation> {
    return this.http.put<Consultation>(`${this.apiUrl}/${consultationId}/complete`, {});
  }

  /**
   * Get all completed consultations for a specific patient.
   * Calls: GET /api/consultations/patient/{patientId}
   */
  getCompletedConsultations(patientId: number): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  /**
   * Get existing consultation record by appointment ID (if any).
   */
  getByAppointment(appointmentId: number): Observable<Consultation> {
    return this.http.get<Consultation>(`${this.apiUrl}/appointment/${appointmentId}`);
  }
}
