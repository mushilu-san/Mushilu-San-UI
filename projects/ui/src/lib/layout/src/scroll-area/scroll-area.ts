import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
} from '@angular/core';

export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';

/**
 * ScrollArea — a custom-styled scrollable region.
 * Uses CSS to style the scrollbar to match the design system.
 *
 * Usage:
 *   <mui-scroll-area style="height:200px;">
 *     Long content here…
 *   </mui-scroll-area>
 */
@Component({
  selector: 'mui-scroll-area',
  standalone: true,
  template: `
    <div class="mui-scroll-area__viewport" part="viewport">
      <ng-content />
    </div>
  `,
  styleUrl: './scroll-area.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.data-orientation]': 'orientation()',
    '[attr.part]': '"root"',
  },
})
export class ScrollArea {
  orientation = input<ScrollAreaOrientation>('vertical');
}
