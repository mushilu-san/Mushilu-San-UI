import { Directive, HostListener, computed, inject } from '@angular/core';
import { DROPDOWN_MENU_CONTEXT } from './dropdown-menu';

/**
 * Marks an element as the trigger for the enclosing `<mui-dropdown-menu>`.
 */
@Directive({
  selector: '[muiDropdownTrigger]',
  standalone: true,
  host: {
    '[attr.aria-expanded]': 'isOpen() ? "true" : "false"',
    '[attr.aria-haspopup]': '"menu"',
    '[attr.part]': '"trigger"',
  },
})
export class DropdownTrigger {
  private readonly ctx = inject(DROPDOWN_MENU_CONTEXT);
  protected readonly isOpen = computed(() => this.ctx.open());

  @HostListener('click', ['$event'])
  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
    this.ctx.toggle();
  }
}
