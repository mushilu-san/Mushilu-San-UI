import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  InjectionToken,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { handleRovingFocus } from '@mushilu-san/ui';

export const DROPDOWN_MENU_CONTEXT = new InjectionToken<DropdownMenu>('DROPDOWN_MENU_CONTEXT');

/**
 * Dropdown Menu — a floating list of keyboard-navigable actions.
 * Apply `muiDropdownTrigger` to the trigger element inside.
 *
 * Usage:
 *   <mui-dropdown-menu>
 *     <button muiDropdownTrigger>Options</button>
 *     <mui-dropdown-item (itemClick)="edit()">Edit</mui-dropdown-item>
 *     <mui-dropdown-separator />
 *     <mui-dropdown-item color="danger" (itemClick)="delete()">Delete</mui-dropdown-item>
 *   </mui-dropdown-menu>
 */
@Component({
  selector: 'mui-dropdown-menu',
  standalone: true,
  templateUrl: './dropdown-menu.html',
  styleUrl: './dropdown-menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.data-open]': 'open() ? "" : null',
    '[attr.part]': '"root"',
  },
  providers: [{ provide: DROPDOWN_MENU_CONTEXT, useExisting: DropdownMenu }],
})
export class DropdownMenu {
  open = model(false);
  closeOnEscape = input(true, { transform: booleanAttribute });
  closeOnSelect = input(true, { transform: booleanAttribute });

  readonly opened = output<void>();
  readonly closed = output<void>();

  private readonly el = inject(ElementRef);
  private readonly doc = inject(DOCUMENT);
  private _triggerEl: HTMLElement | null = null;

  toggle(): void {
    const next = !this.open();
    if (next) {
      this._triggerEl = this.doc.activeElement as HTMLElement | null;
    }
    this.open.set(next);
    if (next) {
      this.opened.emit();
    } else {
      this.closed.emit();
    }
  }

  close(): void {
    if (!this.open()) return;
    this.open.set(false);
    this.closed.emit();
  }

  /** Called by DropdownItem on selection. */
  onItemSelected(): void {
    if (this.closeOnSelect()) this.close();
  }

  /** Arrow-key / Home / End / Escape / Tab navigation across items. */
  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (!this.open()) return;
    const host = this.el.nativeElement as HTMLElement;
    // Query enabled menu items at runtime — avoids circular contentChildren import
    const items = Array.from(
      host.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not([aria-disabled="true"])'),
    );
    if (!items.length) return;

    if (!handleRovingFocus(event, items as HTMLElement[], this.doc.activeElement)) {
      switch (event.key) {
        case 'Escape':
          if (this.closeOnEscape()) {
            event.preventDefault();
            this.close();
            // H-E-c091ef: display:none on close force-blurs any focused item, so
            // the trigger captured at open time must be re-focused explicitly.
            this._triggerEl?.focus();
          }
          break;
        case 'Tab':
          this.close();
          break;
      }
    }
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.open()) return;
    if (!(this.el.nativeElement as HTMLElement).contains(event.target as Node)) {
      this.close();
    }
  }
}
