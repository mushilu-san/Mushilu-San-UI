import { Directive, HostListener, inject } from '@angular/core';
import { HOVER_CARD_CONTEXT } from './hover-card';

/**
 * [muiHoverCardTrigger] — attach to the element that triggers the hover card.
 * Works with any focusable element (links, buttons, spans with tabindex).
 */
@Directive({
  selector: '[muiHoverCardTrigger]',
  standalone: true,
  host: { '[attr.part]': '"trigger"' },
})
export class HoverCardTrigger {
  private readonly ctx = inject(HOVER_CARD_CONTEXT);

  @HostListener('mouseenter') onMouseEnter(): void {
    this.ctx.scheduleOpen();
  }
  @HostListener('mouseleave') onMouseLeave(): void {
    this.ctx.scheduleClose();
  }
  @HostListener('focus') onFocus(): void {
    this.ctx.scheduleOpen();
  }
  @HostListener('blur') onBlur(): void {
    this.ctx.scheduleClose();
  }
}
