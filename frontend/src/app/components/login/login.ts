import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

/**
 * LoginComponent — User Authentication Screen with Quick Demo Role Fillers.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  isLoading = false;
  errorMessage = '';

  loginForm: FormGroup = this.fb.group({
    email: ['doctor@equicare.com', [Validators.required]],
    password: ['doctor123', [Validators.required]]
  });

  submitLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.toastService.success(`Welcome back, ${user.name}! (${user.role})`);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Invalid credentials. Please try again.';
        this.toastService.error(this.errorMessage);
      }
    });
  }

  // Quick Demo account fillers for review convenience
  fillDoctor(): void {
    this.loginForm.setValue({
      email: 'doctor@equicare.com',
      password: 'doctor123'
    });
    this.errorMessage = '';
  }

  fillReceptionist(): void {
    this.loginForm.setValue({
      email: 'reception@equicare.com',
      password: 'reception123'
    });
    this.errorMessage = '';
  }
}
