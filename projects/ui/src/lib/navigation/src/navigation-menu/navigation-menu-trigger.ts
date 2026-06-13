import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
} from '@angular/core';
import { NAV_MENU_ITEM_CONTEXT } from './navigation-menu-context';

@Component({
  selector: 'button[muiNavMenuTrigger]',
  standalone: true,
  templateUrl: './navigation-menu-trigger.html',
  styleUrl: './navigation-menu-trigger.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    type: 'button',
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.aria-haspopup]': '"true"',
    '[attr.data-open]': 'isOpen() ? "" : null',
    '[attr.part]': '"trigger"',
    '(click)': 'ctx.toggle()',
  },
})
export class NavigationMenuTrigger {
  protected readonly ctx = inject(NAV_MENU_ITEM_CONTEXT);
  protected readonly isOpen = computed(() => this.ctx.isOpen());
}
