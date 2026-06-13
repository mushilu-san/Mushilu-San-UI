import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
} from '@angular/core';
import { MENUBAR_MENU_CONTEXT } from './menubar-context';

@Component({
  selector: 'button[muiMenubarTrigger]',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './menubar-trigger.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    type: 'button',
    role: 'menuitem',
    '[attr.aria-haspopup]': '"menu"',
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.data-open]': 'isOpen() ? "" : null',
    '[attr.part]': '"trigger"',
    '[attr.tabindex]': '0',
    '(click)': 'ctx.toggle()',
    '(keydown.ArrowDown)': 'onArrowDown($event)',
  },
})
export class MenubarTrigger {
  protected readonly ctx = inject(MENUBAR_MENU_CONTEXT);
  protected readonly isOpen = computed(() => this.ctx.isOpen());

  protected onArrowDown(event: Event): void {
    event.preventDefault();
    if (!this.ctx.isOpen()) {
      this.ctx.toggle();
    }
  }
}
