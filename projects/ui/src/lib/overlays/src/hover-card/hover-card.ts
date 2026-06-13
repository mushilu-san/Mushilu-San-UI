import {
  ChangeDetectionStrategy,
  Component,
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
  open = model(false);
  placement = input<PopoverPlacement>('bottom');
  openDelay = input(700, { transform: numberAttribute });
  closeDelay = input(300, { transform: numberAttribute });

  readonly opened = output<void>();
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
