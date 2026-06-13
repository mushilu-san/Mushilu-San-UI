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
  disabled = input(false, { transform: booleanAttribute });
  color = input<ContextMenuItemColor>('default');
  shortcut = input<string>();

  readonly selected = output<void>();

  private readonly ctx = inject(CONTEXT_MENU_CONTEXT);

  protected onSelect(): void {
    if (this.disabled()) return;
    this.selected.emit();
    this.ctx.onItemSelected();
  }
}
