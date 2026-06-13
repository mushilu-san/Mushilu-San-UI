import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
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
}
