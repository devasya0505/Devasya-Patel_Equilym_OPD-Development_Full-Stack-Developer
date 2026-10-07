import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar';
import { ToastService } from './services/toast.service';

/**
 * Root Application Component.
 * 
 * Embeds:
 * 1. Global Navigation Bar (NavbarComponent)
 * 2. Router Outlet (Active Screen)
 * 3. Global Floating Toast Notification Container
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  toastService = inject(ToastService);
  toasts$ = this.toastService.toasts$;
}
