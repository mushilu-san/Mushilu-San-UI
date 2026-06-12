import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  ViewEncapsulation,
  computed,
  forwardRef,
  inject,
} from '@angular/core';
import { NAV_MENU_CONTEXT, NAV_MENU_ITEM_CONTEXT, NavMenuItemContext } from './navigation-menu-context';

let _uid = 0;

@Component({
  selector: 'mui-navigation-menu-item',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './navigation-menu-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    {
      provide: NAV_MENU_ITEM_CONTEXT,
      useExisting: forwardRef(() => NavigationMenuItem),
    },
  ],
  host: { '[attr.part]': '"item"', '[attr.data-open]': 'isOpen() ? "" : null' },
})
export class NavigationMenuItem implements NavMenuItemContext {
  private readonly root = inject(NAV_MENU_CONTEXT);

  readonly id: string = `nav-item-${++_uid}`;
  readonly isOpen: Signal<boolean> = computed(() => this.root.openId() === this.id);

  toggle(): void {
    this.root.setOpen(this.isOpen() ? null : this.id);
  }
}
