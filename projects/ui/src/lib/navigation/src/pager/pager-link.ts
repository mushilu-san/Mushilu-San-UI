import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import type { PagerDirection } from './pager.types';

/**
 * Pager link — a previous/next anchor with a direction label and a chevron that mirrors in RTL.
 * Because it enhances a real `<a>`, add `href` or `routerLink` yourself.
 */
@Component({
  selector: 'a[muiPagerLink]',
  standalone: true,
  templateUrl: './pager-link.html',
  styleUrl: './pager-link.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.data-direction]': 'direction()',
    '[attr.rel]': 'relValue()',
    '[attr.part]': '"root"',
  },
})
export class PagerLink {
  /** Which way this link goes. */
  direction = input<PagerDirection>('next');
  /** Small label above the title, e.g. "Previous" (translate it). */
  directionLabel = input<string | undefined>(undefined);
  /** Overrides the default `rel` (`prev` / `next`). */
  rel = input<string | undefined>(undefined);

  protected readonly relValue = computed(
    () => this.rel() ?? (this.direction() === 'previous' ? 'prev' : 'next'),
  );
}
