import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
  input,
} from '@angular/core';
import { Toast } from './toast';
import { ToastService } from './toast.service';
import type { ToastRef } from './toast.types';

export type ToastPlacement =
  'top-start' | 'top-center' | 'top-end' | 'bottom-start' | 'bottom-center' | 'bottom-end';

@Component({
  selector: 'mui-toast-container',
  standalone: true,
  imports: [Toast],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.role]': '"region"',
    '[attr.aria-label]': 'label()',
    '[attr.data-placement]': 'placement()',
    '[attr.part]': '"root"',
  },
})
export class ToastContainer {
  placement = input<ToastPlacement>('bottom-end');
  /** Accessible name for the notifications landmark. */
  label = input<string>('Notifications');

  private readonly service = inject(ToastService);

  /** Polite (info/success) toasts — announced without interrupting. */
  protected readonly politeToasts = computed(() =>
    this.service.toasts().filter((t) => t.variant === 'info' || t.variant === 'success'),
  );

  /** Assertive (warning/danger) toasts — announced immediately. */
  protected readonly urgentToasts = computed(() =>
    this.service.toasts().filter((t) => t.variant === 'warning' || t.variant === 'danger'),
  );

  protected dismiss(id: number): void {
    this.service.dismiss(id);
  }

  protected trackId(_index: number, toast: ToastRef): number {
    return toast.id;
  }
}
