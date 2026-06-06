import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  input,
} from '@angular/core';
import type { InputSize, InputVariant } from './input.types';

@Component({
  selector: 'input[muiInput]',
  standalone: true,
  template: '',
  styleUrl: './input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.data-size]':    'size()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-invalid]': 'invalid() || null',
    '[attr.part]':         '"input"',
  },
})
export class Input {
  size    = input<InputSize>('md');
  variant = input<InputVariant>('outline');
  invalid = input(false, { transform: booleanAttribute });
}
