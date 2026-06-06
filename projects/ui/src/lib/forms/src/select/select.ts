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
    '[attr.data-size]':    'size()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-invalid]': 'invalid() || null',
    '[attr.part]':         '"select"',
  },
})
export class Select {
  size    = input<SelectSize>('md');
  variant = input<SelectVariant>('outline');
  invalid = input(false, { transform: booleanAttribute });
}
