import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User } from '../models/opd.models';

/**
 * AuthService — Manages User Authentication state and session persistence.
 * 
 * Uses Angular 22 Signals (`signal`, `computed`) for reactive state management.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly apiUrl = 'http://localhost:8080/api/auth';
  private readonly storageKey = 'equicare_user';

  // Current logged in user Signal
  currentUser = signal<User | null>(this.getStoredUser());

  // Computed state
  isLoggedIn = computed(() => !!this.currentUser());
  userRole = computed(() => this.currentUser()?.role || null);
  userName = computed(() => this.currentUser()?.name || 'Guest');

  private getStoredUser(): User | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  /**
   * Log in with credentials and store session token.
   */
  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, credentials).pipe(
      tap((user) => {
        this.currentUser.set(user);
        localStorage.setItem(this.storageKey, JSON.stringify(user));
      })
    );
  }

  /**
   * Log out current user and redirect to /login.
   */
  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(this.storageKey);
    this.router.navigate(['/login']);
  }
}
