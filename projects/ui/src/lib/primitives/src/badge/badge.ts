import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  input,
} from '@angular/core';
import type { BadgeSize, BadgeVariant } from './badge.types';

@Component({
  selector: 'mui-badge',
  standalone: true,
  templateUrl: './badge.html',
  styleUrl: './badge.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-dot]': 'dot() ? "" : null',
    '[attr.aria-label]': 'dot() && label() ? label() : null',
    '[attr.aria-hidden]': 'dot() && !label() ? "true" : null',
    '[attr.part]': '"root"',
  },
})
export class Badge {
  variant = input<BadgeVariant>('default');
  size = input<BadgeSize>('md');
  dot = input(false, { transform: booleanAttribute });
  label = input<string>();
}
