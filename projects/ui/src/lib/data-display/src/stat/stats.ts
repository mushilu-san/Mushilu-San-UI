import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

/**
 * Stats — a responsive list of `mui-stat` figures.
 *
 * Usage:
 *   <mui-stats aria-label="Site totals">
 *     <mui-stat value="1,200" label="Readers" />
 *     <mui-stat value="48" label="Articles" />
 *   </mui-stats>
 */
@Component({
  selector: 'mui-stats',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './stats.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    role: 'list',
    '[attr.part]': '"root"',
  },
})
export class Stats {}
