import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

/**
 * Global Application Configuration.
 * 
 * provideHttpClient() registers Angular's HttpClient service globally,
 * allowing our API services to make HTTP GET, POST, PUT requests to the Spring Boot backend.
 * 
 * provideRouter(routes) enables client-side routing between the 3 module screens.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient()
  ]
};
