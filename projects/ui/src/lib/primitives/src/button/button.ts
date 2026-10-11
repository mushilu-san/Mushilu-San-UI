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
import type { ButtonSize, ButtonVariant } from './button.types';

@Component({
  selector: 'button[muiButton], a[muiButton]',
  standalone: true,
  templateUrl: './button.html',
  styleUrl: './button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.aria-disabled]': 'disabled() || loading() ? "true" : null',
    '[attr.aria-busy]': 'loading() ? "true" : null',
    '[class.mui-loading]': 'loading()',
    '[attr.tabindex]': 'disabled() ? "-1" : null',
    '[attr.part]': '"root"',
  },
})
export class Button {
  /** Visual style: `primary` for the main action, `secondary` for supporting actions, `ghost` for low emphasis, `destructive` for irreversible actions. Default `primary`. */
  variant = input<ButtonVariant>('primary');
  /** Button size. Every size keeps a 44px minimum touch target. Default `md`. */
  size = input<ButtonSize>('md');
  /** Disables the button. Sets `aria-disabled` and swallows clicks but keeps the element in the DOM. */
  disabled = input(false, { transform: booleanAttribute });
  /** Shows a spinner and sets `aria-busy`. Clicks are ignored while loading. */
  loading = input(false, { transform: booleanAttribute });

  /** Emits the native click event unless the button is disabled or loading. */
  readonly clicked = output<MouseEvent>();

  protected readonly isInteractive = computed(() => !this.disabled() && !this.loading());

  @HostListener('click', ['$event'])
  protected handleClick(event: Event): void {
    if (!this.isInteractive()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    this.clicked.emit(event as MouseEvent);
  }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  protected handleKeyActivation(event: Event): void {
    if (!this.isInteractive()) {
      event.preventDefault();
    }
  }
}
