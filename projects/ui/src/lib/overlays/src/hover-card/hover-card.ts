import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  InjectionToken,
  OnDestroy,
  Signal,
  ViewEncapsulation,
  input,
  model,
  numberAttribute,
  output,
} from '@angular/core';
import type { PopoverPlacement } from '../popover/popover.types';

export interface HoverCardContext {
  readonly open: Signal<boolean>;
  readonly placement: Signal<PopoverPlacement>;
  scheduleOpen(): void;
  scheduleClose(): void;
  cancelClose(): void;
}

export const HOVER_CARD_CONTEXT = new InjectionToken<HoverCardContext>('HOVER_CARD_CONTEXT');

/**
 * HoverCard — a popover that opens on hover/focus with a configurable delay.
 * Stays open when the pointer moves from trigger into the card content.
 *
 * Usage:
 *   <mui-hover-card>
 *     <a muiHoverCardTrigger href="#">Hover me</a>
 *     <mui-hover-card-content>
 *       Rich preview content here.
 *     </mui-hover-card-content>
 *   </mui-hover-card>
 */
@Component({
  selector: 'mui-hover-card',
  standalone: true,
  template: `<ng-content />`,
  styleUrl: './hover-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    {
      provide: HOVER_CARD_CONTEXT,
      useFactory: (self: HoverCard) => ({
        open: self.open,
        placement: self.placement,
        scheduleOpen: () => self.scheduleOpen(),
        scheduleClose: () => self.scheduleClose(),
        cancelClose: () => self.cancelClose(),
      }),
      deps: [HoverCard],
    },
  ],
  host: { '[attr.part]': '"root"' },
})
export class HoverCard implements OnDestroy {
  /** Whether the card is open. Two-way bindable with `[(open)]`. */
  open = model(false);
  /** Side of the trigger the card opens on. Default `bottom`. */
  placement = input<PopoverPlacement>('bottom');
  /** Milliseconds to wait after the pointer arrives before opening. Default `700`. */
  openDelay = input(700, { transform: numberAttribute });
  /** Milliseconds to wait after the pointer leaves before closing. Default `300`. */
  closeDelay = input(300, { transform: numberAttribute });

  /** Emits when the card opens. */
  readonly opened = output<void>();
  /** Emits when the card closes. */
  readonly closed = output<void>();

  private openTimer: ReturnType<typeof setTimeout> | null = null;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  scheduleOpen(): void {
    this.clearClose();
    if (this.open()) return;
    this.openTimer = setTimeout(() => {
      this.open.set(true);
      this.opened.emit();
    }, this.openDelay());
  }

  /** H-E-19e98b: Escape dismisses the card without moving focus (WCAG 1.4.13). */
  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (!this.open()) return;
    this.clearOpen();
    this.clearClose();
    this.open.set(false);
    this.closed.emit();
  }

  scheduleClose(): void {
    this.clearOpen();
    this.closeTimer = setTimeout(() => {
      this.open.set(false);
      this.closed.emit();
    }, this.closeDelay());
  }

  cancelClose(): void {
    if (this.closeTimer !== null) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  private clearOpen(): void {
    if (this.openTimer !== null) {
      clearTimeout(this.openTimer);
      this.openTimer = null;
    }
  }

  private clearClose(): void {
    if (this.closeTimer !== null) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  ngOnDestroy(): void {
    this.clearOpen();
    this.clearClose();
  }
}
