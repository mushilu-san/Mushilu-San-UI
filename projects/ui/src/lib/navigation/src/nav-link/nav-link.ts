import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  input,
} from '@angular/core';
import type { NavLinkSize, NavLinkVariant } from './nav-link.types';

@Component({
  selector: 'a[muiNavLink]',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './nav-link.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-active]': 'active() ? "" : null',
    '[attr.aria-current]': 'active() ? "page" : null',
    '[attr.part]': '"nav-link"',
  },
})
export class NavLink {
  variant = input<NavLinkVariant>('default');
  size = input<NavLinkSize>('md');
  active = input(false, { transform: booleanAttribute });
}
