import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

/**
 * Pager — previous / next navigation landmark holding up to two `a[muiPagerLink]` items.
 *
 * Usage:
 *   <mui-pager label="Series navigation">
 *     <a muiPagerLink direction="previous" href="/p1" directionLabel="Previous">Part 1</a>
 *     <a muiPagerLink direction="next" routerLink="/p3" directionLabel="Next">Part 3</a>
 *   </mui-pager>
 */
@Component({
  selector: 'mui-pager',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './pager.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    role: 'navigation',
    '[attr.aria-label]': 'label()',
    '[attr.part]': '"root"',
  },
})
export class Pager {
  /** Accessible name of the navigation landmark (translate it). */
  label = input<string>('Pagination');
}
