import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import type { SpinnerColor, SpinnerSize } from './spinner.types';

const SIZE_PX: Record<SpinnerSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

@Component({
  selector: 'mui-spinner',
  standalone: true,
  templateUrl: './spinner.html',
  styleUrl: './spinner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.role]': '"status"',
    '[attr.aria-label]': 'label()',
    '[attr.data-size]': 'size()',
    '[attr.data-color]': 'color()',
    '[attr.part]': '"root"',
  },
})
export class Spinner {
  /** Spinner size: `sm` (16px) to `xl` (48px). Default `md` (24px). */
  size = input<SpinnerSize>('md');
  /** Spinner colour from the semantic palette. `inherit` uses the surrounding text colour. */
  color = input<SpinnerColor>('inherit');
  /** Text announced to screen readers while loading. Default `Loading`. */
  label = input<string>('Loading');

  protected readonly svgSize = computed(() => SIZE_PX[this.size()]);
}
