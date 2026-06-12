import {
  Directive,
  HostListener,
  computed,
  inject,
} from '@angular/core';
import { POPOVER_CONTEXT } from './popover';

/**
 * Marks an element as the trigger for the enclosing `<mui-popover>`.
 * Sets `aria-expanded` and `aria-haspopup` automatically.
 *
 * Usage:
 *   <button muiPopoverTrigger>Open</button>
 */
@Directive({
  selector: '[muiPopoverTrigger]',
  standalone: true,
  host: {
    '[attr.aria-expanded]': 'isOpen() ? "true" : "false"',
    '[attr.aria-haspopup]': '"dialog"',
    '[attr.part]': '"trigger"',
  },
})
export class PopoverTrigger {
  private readonly ctx = inject(POPOVER_CONTEXT);
  protected readonly isOpen = computed(() => this.ctx.open());

  @HostListener('click', ['$event'])
  protected onClick(event: MouseEvent): void {
    // Stop propagation so the document:click handler in Popover
    // does not immediately close the panel that was just opened.
    event.stopPropagation();
    this.ctx.toggle();
  }
}
