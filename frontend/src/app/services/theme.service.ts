import { Injectable, signal } from '@angular/core';

export type AppTheme = 'dark' | 'light';

/**
 * ThemeService — Controls Dark / Light theme switching using the custom palette.
 * 
 * Palette:
 * - Caribbean Current: #16697A
 * - Moonstone:         #489FB5
 * - Sky Blue:          #82C0CC
 * - Isabelline:        #EDE7E3
 * - Orange Peel:       #FFA62B
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'equicare_theme';
  
  // Default to light mode or saved preference
  currentTheme = signal<AppTheme>('light');

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    const savedTheme = localStorage.getItem(this.storageKey) as AppTheme;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      this.setTheme(savedTheme);
    } else {
      // Default to light for clean presentation
      this.setTheme('light');
    }
  }

  toggleTheme(): void {
    const nextTheme: AppTheme = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  setTheme(theme: AppTheme): void {
    this.currentTheme.set(theme);
    localStorage.setItem(this.storageKey, theme);

    const root = document.documentElement;
    const body = document.body;

    root.setAttribute('data-theme', theme);
    if (theme === 'light') {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
      body?.classList.add('light-theme');
      body?.classList.remove('dark-theme');
    } else {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
      body?.classList.add('dark-theme');
      body?.classList.remove('light-theme');
    }
  }

  isDark(): boolean {
    return this.currentTheme() === 'dark';
  }
}
