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
import type { FabSize, FabVariant } from './fab.types';

let fabUid = 0;

/**
 * Floating Action Button — a circular button that floats above content
 * for the primary (or secondary) action on a screen.
 *
 * Usage:
 *   <mui-fab label="Add item">
 *     <svg …/>
 *   </mui-fab>
 *
 *   <!-- Extended FAB (icon + text label) -->
 *   <mui-fab label="Compose" extended>
 *     <svg …/>
 *   </mui-fab>
 */
@Component({
  selector: 'mui-fab',
  standalone: true,
  templateUrl: './fab.html',
  styleUrl: './fab.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-extended]': 'extended() ? "" : null',
    '[attr.part]': '"root"',
  },
})
export class Fab {
  /** Visual style. */
  variant = input<FabVariant>('primary');
  /** Size: sm = 40px, md = 56px (default), lg = 96px. */
  size = input<FabSize>('md');
  /** Accessible label — always required; shown as visible text when extended. */
  label = input.required<string>();
  /** Show label text alongside the icon (extended FAB pattern). */
  extended = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });
  loading = input(false, { transform: booleanAttribute });

  readonly clicked = output<MouseEvent>();

  protected readonly uid = fabUid++;
  protected readonly isInteractive = computed(() => !this.disabled() && !this.loading());

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  protected handleKeyActivation(event: Event): void {
    if (!this.isInteractive()) {
      event.preventDefault();
    }
  }

  protected handleClick(event: MouseEvent): void {
    if (!this.isInteractive()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    this.clicked.emit(event);
  }
}
