import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { DROPDOWN_MENU_CONTEXT } from './dropdown-menu';
import type { DropdownItemColor } from './dropdown-menu.types';

/**
 * An individual item inside `<mui-dropdown-menu>`.
 */
@Component({
  selector: 'mui-dropdown-item',
  standalone: true,
  template: `
    <button
      #btn
      class="mui-dropdown-item__btn"
      part="button"
      type="button"
      role="menuitem"
      [attr.data-color]="color()"
      [attr.aria-disabled]="disabled() ? 'true' : null"
      [attr.tabindex]="disabled() ? '-1' : '-1'"
      (click)="handleClick()"
    >
      @if (hasIcon()) {
        <span class="mui-dropdown-item__icon" part="icon" aria-hidden="true">
          <ng-content select="[slot=icon]" />
        </span>
      }
      <span class="mui-dropdown-item__label" part="label">
        <ng-content />
      </span>
      @if (shortcut()) {
        <span class="mui-dropdown-item__shortcut" part="shortcut" aria-hidden="true">{{ shortcut() }}</span>
      }
    </button>
  `,
  styleUrl: './dropdown-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: { '[attr.part]': '"item"' },
})
export class DropdownItem {
  color    = input<DropdownItemColor>('default');
  disabled = input(false, { transform: booleanAttribute });
  shortcut = input<string>();
  hasIcon  = input(false, { transform: booleanAttribute });

  readonly itemClick = output<void>();

  private readonly ctx = inject(DROPDOWN_MENU_CONTEXT);
  private readonly btnRef = viewChild<ElementRef<HTMLButtonElement>>('btn');

  /** Public accessor used by DropdownMenu for focus management. */
  buttonEl(): HTMLButtonElement | undefined {
    return this.btnRef()?.nativeElement;
  }

  protected handleClick(): void {
    if (this.disabled()) return;
    this.itemClick.emit();
    this.ctx.onItemSelected();
  }
}
