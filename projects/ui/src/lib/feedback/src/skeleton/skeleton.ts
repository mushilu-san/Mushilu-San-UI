import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  numberAttribute,
} from '@angular/core';
import type { SkeletonVariant } from './skeleton.types';

@Component({
  selector: 'mui-skeleton',
  standalone: true,
  templateUrl: './skeleton.html',
  styleUrl: './skeleton.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    // Purely presentational placeholder — hidden from assistive tech.
    // The surrounding region should carry aria-busy="true".
    '[attr.aria-hidden]': '"true"',
    '[attr.data-variant]': 'variant()',
    '[attr.part]': '"root"',
  },
})
export class Skeleton {
  variant = input<SkeletonVariant>('text');
  /** CSS size, e.g. "200px" or "100%". For circle, used as the diameter. */
  width = input<string>();
  height = input<string>();
  /** Number of placeholder lines (text variant only). */
  lines = input(1, { transform: numberAttribute });

  protected readonly lineCount = computed(() => Math.max(1, this.lines()));
  protected readonly lineArray = computed(() => Array.from({ length: this.lineCount() }));

  protected readonly itemWidth = computed(() =>
    this.variant() === 'circle' ? (this.width() ?? this.height()) : this.width(),
  );
  protected readonly itemHeight = computed(() =>
    this.variant() === 'circle' ? (this.height() ?? this.width()) : this.height(),
  );
}
