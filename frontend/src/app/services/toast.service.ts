import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
}

/**
 * ToastService — Global alert & toast notifications using RxJS BehaviorSubject.
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  toasts$ = this.toastsSubject.asObservable();
  private counter = 0;

  show(text: string, type: 'success' | 'error' | 'info' = 'success', duration = 3500) {
    const id = ++this.counter;
    const current = this.toastsSubject.value;
    this.toastsSubject.next([...current, { id, text, type }]);

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  success(text: string) {
    this.show(text, 'success');
  }

  error(text: string) {
    this.show(text, 'error', 5000);
  }

  info(text: string) {
    this.show(text, 'info');
  }

  remove(id: number) {
    const updated = this.toastsSubject.value.filter(t => t.id !== id);
    this.toastsSubject.next(updated);
  }
}
