import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  output,
} from '@angular/core';
import type { AlertVariant } from './alert.types';

@Component({
  selector: 'mui-alert',
  standalone: true,
  templateUrl: './alert.html',
  styleUrl: './alert.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    // danger/warning interrupt (assertive); info/success announce politely.
    '[attr.role]':      'assertive() ? "alert" : "status"',
    '[attr.aria-live]': 'assertive() ? "assertive" : "polite"',
    '[attr.data-variant]': 'variant()',
    '[attr.part]':         '"root"',
  },
})
export class Alert {
  /** Visual + semantic severity. */
  variant = input<AlertVariant>('info');
  /** Optional bold heading rendered above the projected body. */
  heading = input<string>();
  /** Show a dismiss button and enable Escape-to-dismiss. */
  dismissible = input(false, { transform: booleanAttribute });

  /** Emitted when the user dismisses the alert (button or Escape). */
  readonly dismissed = output<void>();

  protected readonly assertive = computed(
    () => this.variant() === 'danger' || this.variant() === 'warning',
  );

  dismiss(): void {
    this.dismissed.emit();
  }

  @HostListener('keydown.escape')
  protected onEscape(): void {
    if (this.dismissible()) {
      this.dismiss();
    }
  }
}
