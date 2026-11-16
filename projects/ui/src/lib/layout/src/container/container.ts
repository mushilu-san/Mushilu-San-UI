import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  input,
} from '@angular/core';
import type { ContainerSize } from './container.types';

@Component({
  selector: 'mui-container',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './container.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.data-size]': 'size()',
    '[style.max-width]': 'maxWidth()',
    '[attr.data-padded]': 'padded() || null',
    '[attr.part]': '"root"',
  },
})
export class Container {
  /** Controls the max-width breakpoint of the container. */
  size = input<ContainerSize>('lg');

  /** Custom max-width (any CSS length, e.g. `72rem`). Overrides `size` when set. */
  maxWidth = input<string | undefined>(undefined);

  /** Whether the container applies inline (horizontal) padding. */
  padded = input(true, { transform: booleanAttribute });
}
