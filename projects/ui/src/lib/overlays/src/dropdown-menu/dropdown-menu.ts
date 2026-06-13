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

  toggle(): void {
    const next = !this.open();
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

    const idx = items.indexOf(document.activeElement as HTMLButtonElement);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        items[(idx + 1) % items.length].focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        items[(idx - 1 + items.length) % items.length].focus();
        break;
      case 'Home':
        event.preventDefault();
        items[0].focus();
        break;
      case 'End':
        event.preventDefault();
        items[items.length - 1].focus();
        break;
      case 'Escape':
        if (this.closeOnEscape()) {
          event.preventDefault();
          this.close();
        }
        break;
      case 'Tab':
        this.close();
        break;
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
