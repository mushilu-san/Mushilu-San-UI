import { Directive, HostListener, NgZone, OnDestroy, inject } from '@angular/core';
import { CONTEXT_MENU_CONTEXT } from './context-menu';

const LONG_PRESS_MS = 600;

/**
 * [muiContextMenuTrigger] — attach to any element inside <mui-context-menu>
 * to make it the right-click / long-press trigger area.
 */
@Directive({
  selector: '[muiContextMenuTrigger]',
  standalone: true,
  host: {
    '[attr.part]': '"trigger"',
  },
})
export class ContextMenuTrigger implements OnDestroy {
  private readonly ctx  = inject(CONTEXT_MENU_CONTEXT);
  private readonly zone = inject(NgZone);

  private longPressTimer: ReturnType<typeof setTimeout> | null = null;
  private touchStartX = 0;
  private touchStartY = 0;

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.ctx.openAt(event.clientX, event.clientY);
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.longPressTimer = setTimeout(() => {
      this.zone.run(() => this.ctx.openAt(this.touchStartX, this.touchStartY));
    }, LONG_PRESS_MS);
  }

  @HostListener('touchmove')
  onTouchMove(): void {
    this.clearLongPress();
  }

  @HostListener('touchend')
  onTouchEnd(): void {
    this.clearLongPress();
  }

  private clearLongPress(): void {
    if (this.longPressTimer !== null) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  ngOnDestroy(): void {
    this.clearLongPress();
  }
}
