import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  model,
  numberAttribute,
} from '@angular/core';

import type { PaginationSize, PaginationVariant } from './pagination.types';

@Component({
  selector: 'mui-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-variant]': 'variant()',
    '[attr.part]': '"pagination"',
    role: 'navigation',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class Pagination {
  /** Current page, starting at 1. Two-way bindable with `[(page)]`. */
  page = model<number>(1);
  /** Total number of pages. */
  totalPages = input.required<number, number>({ transform: numberAttribute });
  /** Number of page buttons shown on each side of the current page. Default `1`. */
  siblingCount = input(1, { transform: numberAttribute });
  /** Shows the first and last page buttons next to the ellipses. Default `true`. */
  showFirstLast = input(true, { transform: booleanAttribute });
  /** Button size: `sm`, `md` or `lg`. Default `md`. */
  size = input<PaginationSize>('md');
  /** Visual style: `default` or `outline`. Default `default`. */
  variant = input<PaginationVariant>('default');
  /** Accessible name of the navigation landmark. Default `Pagination`. */
  ariaLabel = input<string>('Pagination');

  protected pages = computed(() => this.buildPages());

  protected get prevDisabled() {
    return this.page() <= 1;
  }
  protected get nextDisabled() {
    return this.page() >= this.totalPages();
  }

  protected goTo(p: number): void {
    if (p < 1 || p > this.totalPages() || p === this.page()) return;
    this.page.set(p);
  }

  protected onKeydown(event: KeyboardEvent, p: number | null): void {
    if (p === null) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.goTo(p);
    }
  }

  private buildPages(): (number | null)[] {
    const total = this.totalPages();
    const current = this.page();
    const siblings = this.siblingCount();

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const left = Math.max(2, current - siblings);
    const right = Math.min(total - 1, current + siblings);
    const showLeftEllipsis = left > 2;
    const showRightEllipsis = right < total - 1;

    const pages: (number | null)[] = [1];
    if (showLeftEllipsis) pages.push(null);
    for (let i = left; i <= right; i++) pages.push(i);
    if (showRightEllipsis) pages.push(null);
    pages.push(total);

    return pages;
  }
}
