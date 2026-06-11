import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
} from '@angular/core';

/**
 * Empty — empty-state placeholder with an icon area, title, description,
 * and an optional call-to-action projected via [slot="action"].
 *
 * Usage:
 *   <mui-empty title="No results found" description="Try adjusting your filters.">
 *     <svg slot="icon" …>…</svg>
 *     <button slot="action" muiButton>Clear filters</button>
 *   </mui-empty>
 */
@Component({
  selector: 'mui-empty',
  standalone: true,
  templateUrl: './empty.html',
  styleUrl: './empty.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.part]': '"root"',
    '[attr.role]': '"status"',
  },
})
export class Empty {
  title       = input<string>();
  description = input<string>();
}
