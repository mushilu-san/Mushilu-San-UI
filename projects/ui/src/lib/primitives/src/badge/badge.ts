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
    // aria-label is only valid on an element with a role; a dot is a graphic, so role=img (H-A-1955ff).
    '[attr.role]': 'dot() && label() ? "img" : null',
    '[attr.aria-label]': 'dot() && label() ? label() : null',
    '[attr.aria-hidden]': 'dot() && !label() ? "true" : null',
    '[attr.part]': '"root"',
  },
})
export class Badge {
  /** Meaning of the badge: `default`, `primary`, `success`, `warning`, `danger` or `info`. */
  variant = input<BadgeVariant>('default');
  /** Badge size. Default `md`. */
  size = input<BadgeSize>('md');
  /** Renders a small coloured dot without text. Pair with `label` so the status is announced. */
  dot = input(false, { transform: booleanAttribute });
  /** Accessible name for a dot badge. Ignored for text badges. */
  label = input<string>();
}
