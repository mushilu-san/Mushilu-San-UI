import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  inject,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { resolveDirection } from '@mushilu-san/ui';
import { anchoredPanel, positionPanel } from '../positioning/anchored-panel';
import { HOVER_CARD_CONTEXT } from './hover-card';

/**
 * HoverCardContent — the panel that appears on hover.
 * Keeps the card open while the pointer is inside it.
 */
@Component({
  selector: 'mui-hover-card-content',
  standalone: true,
  template: `
    @if (ctx.open()) {
      <div
        #panelEl
        class="mui-hover-card-content__panel"
        part="panel"
        role="tooltip"
        [attr.data-placement]="ctx.placement()"
        (mouseenter)="ctx.cancelClose()"
        (mouseleave)="ctx.scheduleClose()"
      >
        <ng-content />
      </div>
    }
  `,
  styleUrl: './hover-card-content.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: { '[attr.part]': '"content"' },
})
export class HoverCardContent {
  protected readonly ctx = inject(HOVER_CARD_CONTEXT);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly doc = inject(DOCUMENT);
  private readonly panelEl = viewChild<ElementRef<HTMLElement>>('panelEl');

  constructor() {
    // H-C-57b708: shared computePosition (4px viewport clamp), re-run on scroll/resize.
    anchoredPanel({
      open: this.ctx.open,
      panel: () => this.panelEl()?.nativeElement,
      place: (panel) => {
        // The <mui-hover-card> host is the positioned ancestor and the anchor.
        const anchorEl = this.host.nativeElement.parentElement ?? this.host.nativeElement;
        const anchor = anchorEl.getBoundingClientRect();
        positionPanel(panel, anchor, this.ctx.placement(), {
          rtl: resolveDirection(anchorEl, this.doc) === 'rtl',
          origin: anchor,
        });
      },
    });
  }
}
