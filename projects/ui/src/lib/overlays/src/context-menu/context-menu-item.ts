import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  input,
  output,
} from '@angular/core';
import { CONTEXT_MENU_CONTEXT } from './context-menu';
import type { ContextMenuItemColor } from './context-menu.types';

@Component({
  selector: 'mui-context-menu-item',
  standalone: true,
  template: `
    <button
      #btn
      type="button"
      class="mui-context-menu-item__btn"
      part="button"
      role="menuitem"
      [attr.aria-disabled]="disabled() || null"
      [attr.data-color]="color()"
      [attr.tabindex]="disabled() ? -1 : 0"
      (click)="onSelect()"
    >
      <ng-content select="[slot=icon]" />
      <span class="mui-context-menu-item__label"><ng-content /></span>
      @if (shortcut()) {
        <span class="mui-context-menu-item__shortcut" aria-hidden="true">{{ shortcut() }}</span>
      }
    </button>
  `,
  styleUrl: './context-menu-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: { '[attr.part]': '"item"' },
})
export class ContextMenuItem {
  /** Disables the item. It is skipped by the arrow keys. */
  disabled = input(false, { transform: booleanAttribute });
  /** Colour of the item: `default` or `danger`. Default `default`. */
  color = input<ContextMenuItemColor>('default');
  /** Keyboard shortcut shown on the right, for display only. */
  shortcut = input<string>();

  /** Emits when the item is chosen. */
  readonly selected = output<void>();

  private readonly ctx = inject(CONTEXT_MENU_CONTEXT);

  protected onSelect(): void {
    if (this.disabled()) return;
    this.selected.emit();
    this.ctx.onItemSelected();
  }
}
