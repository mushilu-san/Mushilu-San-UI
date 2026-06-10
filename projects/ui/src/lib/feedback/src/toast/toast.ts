import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  input,
  numberAttribute,
  output,
} from '@angular/core';
import type { ToastVariant } from './toast.types';

@Component({
  selector: 'mui-toast',
  standalone: true,
  templateUrl: './toast.html',
  styleUrl: './toast.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.part]': '"root"',
    // Pause the auto-dismiss timer while the user is reading or interacting.
    '(mouseenter)': 'pause()',
    '(mouseleave)': 'resume()',
    '(focusin)': 'pause()',
    '(focusout)': 'resume()',
  },
})
export class Toast implements OnInit, OnDestroy {
  variant = input<ToastVariant>('info');
  message = input<string>('');
  heading = input<string>();
  /** ms before auto-dismiss; 0 disables the timer. */
  duration = input(5000, { transform: numberAttribute });

  readonly dismissed = output<void>();

  private timer: ReturnType<typeof setTimeout> | null = null;
  private remaining = 0;
  private startedAt = 0;

  ngOnInit(): void {
    this.remaining = this.duration();
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  dismiss(): void {
    this.clearTimer();
    this.dismissed.emit();
  }

  @HostListener('keydown.escape')
  protected onEscape(): void {
    this.dismiss();
  }

  protected pause(): void {
    if (this.timer === null) {
      return;
    }
    this.clearTimer();
    this.remaining -= Date.now() - this.startedAt;
  }

  protected resume(): void {
    if (this.timer !== null || this.remaining <= 0) {
      return;
    }
    this.startTimer();
  }

  private startTimer(): void {
    if (this.remaining <= 0) {
      return;
    }
    this.startedAt = Date.now();
    this.timer = setTimeout(() => this.dismiss(), this.remaining);
  }

  private clearTimer(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
