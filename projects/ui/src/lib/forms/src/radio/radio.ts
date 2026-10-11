import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import type { RadioSize } from './radio.types';

@Component({
  selector: 'input[type=radio][muiRadio]',
  standalone: true,
  template: '',
  styleUrl: './radio.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.part]': '"radio"',
  },
})
export class Radio {
  /** Radio size: `sm`, `md` or `lg`. Default `md`. */
  size = input<RadioSize>('md');
}
