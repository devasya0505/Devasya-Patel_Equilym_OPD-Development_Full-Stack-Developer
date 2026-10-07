import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

/**
 * NavbarComponent — Top header navigation with branding, active routing, Theme Toggle, and User Profile.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  themeService = inject(ThemeService);
  authService = inject(AuthService);

  // Navigation tabs for the 3 assignment screens + Overview
  navItems = [
    { label: 'Overview', route: '/dashboard', icon: 'fa-chart-pie' },
    { label: 'Patients', route: '/patients', icon: 'fa-users' },
    { label: 'Appointments', route: '/appointments', icon: 'fa-calendar-check' },
    { label: 'Consultations', route: '/consultations', icon: 'fa-user-doctor' }
  ];

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
  }
}
