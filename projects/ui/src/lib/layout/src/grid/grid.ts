import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  numberAttribute,
} from '@angular/core';
import type { GridAlign } from './grid.types';

const ALIGN_MAP: Record<GridAlign, string> = {
  start: 'start',
  center: 'center',
  end: 'end',
  stretch: 'stretch',
};

@Component({
  selector: 'mui-grid',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './grid.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[style.grid-template-columns]': 'templateColumns()',
    '[style.column-gap]': 'columnGapValue()',
    '[style.row-gap]': 'rowGapValue()',
    '[style.align-items]': 'alignValue()',
    '[style.justify-items]': 'justifyValue()',
    '[attr.part]': '"root"',
  },
})
export class Grid {
  /** Number of equal-width columns (uses `repeat(n, minmax(0, 1fr))`). */
  columns = input(1, { transform: numberAttribute });

  /** Gap applied to both axes — a step on the spacing scale (--mui-space-{n}). Overridden by columnGap/rowGap. */
  gap = input(4, { transform: numberAttribute });

  /** Column gap override — a step on the spacing scale (--mui-space-{n}). */
  columnGap = input<number>(undefined, { transform: numberAttribute });

  /** Row gap override — a step on the spacing scale (--mui-space-{n}). */
  rowGap = input<number>(undefined, { transform: numberAttribute });

  /** Block-axis alignment of grid items (align-items). */
  align = input<GridAlign>('stretch');

  /** Inline-axis alignment of grid items (justify-items). */
  justify = input<GridAlign>('stretch');

  protected readonly templateColumns = computed(() => `repeat(${this.columns()}, minmax(0, 1fr))`);
  protected readonly columnGapValue = computed(
    () => `var(--mui-space-${this.columnGap() ?? this.gap()}, 0px)`,
  );
  protected readonly rowGapValue = computed(
    () => `var(--mui-space-${this.rowGap() ?? this.gap()}, 0px)`,
  );
  protected readonly alignValue = computed(() => ALIGN_MAP[this.align()]);
  protected readonly justifyValue = computed(() => ALIGN_MAP[this.justify()]);
}
