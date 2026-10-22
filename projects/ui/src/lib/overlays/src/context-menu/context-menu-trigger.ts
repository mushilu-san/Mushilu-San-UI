import { Directive, ElementRef, HostListener, OnDestroy, inject } from '@angular/core';
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
  private readonly ctx = inject(CONTEXT_MENU_CONTEXT);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  private longPressTimer: ReturnType<typeof setTimeout> | null = null;
  private touchStartX = 0;
  private touchStartY = 0;

  // H-P-5d3c41: none of these handlers call preventDefault, so they are registered
  // passive (HostListener cannot) to keep touch scrolling off the main-thread wait.
  private readonly onTouchStart = (event: TouchEvent): void => {
    const touch = event.touches[0];
    if (!touch) return;
    // H-B-662ead: a second touchstart (multi-touch) must not orphan the first timer.
    this.clearLongPress();
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.longPressTimer = setTimeout(() => {
      this.longPressTimer = null;
      this.ctx.openAt(this.touchStartX, this.touchStartY);
    }, LONG_PRESS_MS);
  };
  private readonly onTouchEndOrCancel = (): void => this.clearLongPress();

  constructor() {
    const opts = { passive: true } as const;
    this.el.addEventListener('touchstart', this.onTouchStart, opts);
    this.el.addEventListener('touchmove', this.onTouchEndOrCancel, opts);
    this.el.addEventListener('touchend', this.onTouchEndOrCancel, opts);
    // H-B-662ead: the OS cancels touches (system gesture, incoming call) without touchend.
    this.el.addEventListener('touchcancel', this.onTouchEndOrCancel, opts);
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.ctx.openAt(event.clientX, event.clientY);
  }

  private clearLongPress(): void {
    if (this.longPressTimer !== null) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  ngOnDestroy(): void {
    this.clearLongPress();
    this.el.removeEventListener('touchstart', this.onTouchStart);
    this.el.removeEventListener('touchmove', this.onTouchEndOrCancel);
    this.el.removeEventListener('touchend', this.onTouchEndOrCancel);
    this.el.removeEventListener('touchcancel', this.onTouchEndOrCancel);
  }
}
