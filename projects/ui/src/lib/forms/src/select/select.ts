import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  input,
} from '@angular/core';
import type { SelectSize, SelectVariant } from './select.types';

@Component({
  selector: 'select[muiSelect]',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './select.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-invalid]': 'invalid() || null',
    '[attr.aria-invalid]': 'invalid() || null',
    '[attr.part]': '"select"',
  },
})
export class Select {
  /** Select height and text size: `sm`, `md` or `lg`. Default `md`. */
  size = input<SelectSize>('md');
  /** Visual style: `outline`, `filled` or `ghost`. Default `outline`. */
  variant = input<SelectVariant>('outline');
  /** Shows the failed-validation style and sets `data-invalid`. Also sets `aria-invalid`. */
  invalid = input(false, { transform: booleanAttribute });
}
