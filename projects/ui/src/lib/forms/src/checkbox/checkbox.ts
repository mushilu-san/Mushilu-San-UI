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
  size = input<CheckboxSize>('md');
  invalid = input(false, { transform: booleanAttribute });
}
