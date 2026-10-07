import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/opd.models';

/**
 * PatientService — Communicates with Spring Boot REST API for Patient CRUD.
 * 
 * @Injectable({ providedIn: 'root' }) makes this service a singleton
 * available throughout the entire application without needing to register in providers array.
 */
@Injectable({
  providedIn: 'root'
})
export class PatientService {
  // Base endpoint for Spring Boot backend
  private readonly apiUrl = 'http://localhost:8080/api/patients';

  // Inject Angular's modern HttpClient using functional inject()
  private http = inject(HttpClient);

  /**
   * Fetch all registered patients.
   * Returns an RxJS Observable emitting the array of patients.
   */
  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl);
  }

  /**
   * Search patients by name or phone keyword.
   * Calls: GET /api/patients/search?keyword=...
   */
  searchPatients(keyword: string): Observable<Patient[]> {
    const params = new HttpParams().set('keyword', keyword.trim());
    return this.http.get<Patient[]>(`${this.apiUrl}/search`, { params });
  }

  /**
   * Get single patient by ID.
   */
  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  /**
   * Register a new patient.
   * Sends HTTP POST with patient payload to Spring Boot.
   */
  registerPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patient);
  }
}
