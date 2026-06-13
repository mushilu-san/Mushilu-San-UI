import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  input,
} from '@angular/core';

@Component({
  selector: 'a[muiNavMenuLink]',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './navigation-menu-link.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.aria-current]': 'active() ? "page" : null',
    '[attr.data-active]': 'active() ? "" : null',
    '[attr.part]': '"link"',
  },
})
export class NavigationMenuLink {
  active = input(false, { transform: booleanAttribute });
}
