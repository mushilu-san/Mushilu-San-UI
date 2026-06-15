import { Injectable, signal } from '@angular/core';
import type { ToastOptions, ToastRef } from './toast.types';

const DEFAULT_DURATION = 5000;
/** Maximum number of toasts rendered at once; oldest are dropped when exceeded. */
const MAX_TOASTS = 5;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;

  private readonly _toasts = signal<ToastRef[]>([]);
  /** The currently visible toasts, oldest first. */
  readonly toasts = this._toasts.asReadonly();

  show(message: string, options: ToastOptions = {}): ToastRef {
    const ref: ToastRef = {
      id: this.nextId++,
      message,
      variant: options.variant ?? 'info',
      duration: options.duration ?? DEFAULT_DURATION,
      title: options.title,
    };
    this._toasts.update((list) => {
      const next = [...list, ref];
      return next.length > MAX_TOASTS ? next.slice(-MAX_TOASTS) : next;
    });
    return ref;
  }

  info(message: string, options?: Omit<ToastOptions, 'variant'>): ToastRef {
    return this.show(message, { ...options, variant: 'info' });
  }

  success(message: string, options?: Omit<ToastOptions, 'variant'>): ToastRef {
    return this.show(message, { ...options, variant: 'success' });
  }

  warning(message: string, options?: Omit<ToastOptions, 'variant'>): ToastRef {
    return this.show(message, { ...options, variant: 'warning' });
  }

  danger(message: string, options?: Omit<ToastOptions, 'variant'>): ToastRef {
    return this.show(message, { ...options, variant: 'danger' });
  }

  dismiss(id: number): void {
    this._toasts.update((list) => list.filter((t) => t.id !== id));
  }

  clear(): void {
    this._toasts.set([]);
  }
}
