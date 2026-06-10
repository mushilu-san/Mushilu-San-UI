import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  numberAttribute,
} from '@angular/core';
import type { ProgressSize, ProgressVariant } from './progress.types';

const RADIUS = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

@Component({
  selector: 'mui-progress',
  standalone: true,
  templateUrl: './progress.html',
  styleUrl: './progress.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.role]':          '"progressbar"',
    '[attr.aria-valuemin]': 'indeterminate() ? null : 0',
    '[attr.aria-valuemax]': 'indeterminate() ? null : max()',
    '[attr.aria-valuenow]': 'indeterminate() ? null : clampedValue()',
    '[attr.aria-label]':    'label()',
    '[attr.aria-busy]':     'indeterminate() ? "true" : null',
    '[attr.data-variant]':  'variant()',
    '[attr.data-size]':     'size()',
    '[attr.data-indeterminate]': 'indeterminate() ? "" : null',
    '[attr.part]':          '"root"',
  },
})
export class Progress {
  value = input(0, { transform: numberAttribute });
  max = input(100, { transform: numberAttribute });
  variant = input<ProgressVariant>('linear');
  size = input<ProgressSize>('md');
  indeterminate = input(false, { transform: booleanAttribute });
  /** Accessible name for the progress bar. */
  label = input<string>();

  protected readonly circumference = CIRCUMFERENCE;
  protected readonly radius = RADIUS;

  protected readonly clampedValue = computed(() => {
    const max = this.max() || 1;
    return Math.min(Math.max(this.value(), 0), max);
  });

  protected readonly percent = computed(
    () => (this.clampedValue() / (this.max() || 1)) * 100,
  );

  /** Stroke offset for the circular indicator (0 = full, circumference = empty). */
  protected readonly dashOffset = computed(
    () => CIRCUMFERENCE * (1 - this.percent() / 100),
  );
}
