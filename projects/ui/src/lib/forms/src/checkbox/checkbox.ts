import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  input,
} from '@angular/core';
import type { CheckboxSize } from './checkbox.types';

@Component({
  selector: 'input[type=checkbox][muiCheckbox]',
  standalone: true,
  template: '',
  styleUrl: './checkbox.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-invalid]': 'invalid() || null',
    '[attr.part]': '"checkbox"',
  },
})
export class Checkbox {
  /** Checkbox size: `sm`, `md` or `lg`. Default `md`. */
  size = input<CheckboxSize>('md');
  /** Shows the failed-validation style and sets `data-invalid`. Does not set `aria-invalid`. */
  invalid = input(false, { transform: booleanAttribute });
}
