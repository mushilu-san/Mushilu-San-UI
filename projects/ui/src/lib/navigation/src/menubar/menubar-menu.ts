import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  ViewEncapsulation,
  computed,
  forwardRef,
  inject,
} from '@angular/core';
import { MENUBAR_CONTEXT, MENUBAR_MENU_CONTEXT, MenubarMenuContext } from './menubar-context';

let _uid = 0;

@Component({
  selector: 'mui-menubar-menu',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './menubar-menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [{ provide: MENUBAR_MENU_CONTEXT, useExisting: forwardRef(() => MenubarMenu) }],
  host: {
    '[attr.data-open]': 'isOpen() ? "" : null',
    '[attr.data-menubar-menu]': '""',
    '[attr.data-menubar-menu-id]': 'id',
    '[attr.part]': '"menu"',
  },
})
export class MenubarMenu implements MenubarMenuContext {
  private readonly root = inject(MENUBAR_CONTEXT);

  readonly id: string = `menubar-menu-${++_uid}`;
  readonly isOpen: Signal<boolean> = computed(() => this.root.openId() === this.id);

  toggle(): void {
    this.root.setOpen(this.isOpen() ? null : this.id);
  }
}
