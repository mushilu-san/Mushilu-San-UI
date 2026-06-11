import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  input,
} from '@angular/core';
import { MENUBAR_CONTEXT } from './menubar-context';

@Component({
  selector: '[muiMenubarItem]',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './menubar-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    'role':                 'menuitem',
    '[attr.tabindex]':      'disabled() ? -1 : 0',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.part]':          '"item"',
    '(click)':              'onClick()',
    '(keydown.enter)':      'onClick()',
    '(keydown.space)':      '$event.preventDefault(); onClick()',
  },
})
export class MenubarItem {
  disabled = input(false, { transform: booleanAttribute });

  private readonly root = inject(MENUBAR_CONTEXT);

  protected onClick(): void {
    if (!this.disabled()) {
      this.root.setOpen(null);
    }
  }
}
