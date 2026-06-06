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
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  disabled = input(false, { transform: booleanAttribute });
  loading = input(false, { transform: booleanAttribute });

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
