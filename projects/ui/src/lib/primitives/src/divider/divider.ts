import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import type { DividerOrientation, DividerVariant } from './divider.types';

@Component({
  selector: 'mui-divider',
  standalone: true,
  templateUrl: './divider.html',
  styleUrl: './divider.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.role]': '"separator"',
    '[attr.aria-orientation]': 'orientation()',
    '[attr.aria-label]': 'label() || null',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-variant]': 'variant()',
    '[attr.part]': '"root"',
  },
})
export class Divider {
  /** Whether the line is horizontal or vertical. Default `horizontal`. */
  orientation = input<DividerOrientation>('horizontal');
  /** Line style: `solid`, `dashed` or `dotted`. Default `solid`. */
  variant = input<DividerVariant>('solid');
  /** Optional text drawn in the middle of a horizontal divider. */
  label = input<string>();
}
