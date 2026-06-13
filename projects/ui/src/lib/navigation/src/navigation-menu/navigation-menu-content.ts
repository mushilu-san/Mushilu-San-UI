import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
} from '@angular/core';
import { NAV_MENU_ITEM_CONTEXT } from './navigation-menu-context';

@Component({
  selector: 'mui-navigation-menu-content',
  standalone: true,
  templateUrl: './navigation-menu-content.html',
  styleUrl: './navigation-menu-content.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.data-open]': 'isOpen() ? "" : null',
    '[attr.part]': '"content"',
    '[attr.hidden]': '!isOpen() ? "" : null',
  },
})
export class NavigationMenuContent {
  private readonly ctx = inject(NAV_MENU_ITEM_CONTEXT);
  protected readonly isOpen = computed(() => this.ctx.isOpen());
}
