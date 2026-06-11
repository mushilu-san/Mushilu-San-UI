import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';

import type { BreadcrumbItem } from './breadcrumb.types';

@Component({
  selector: 'mui-breadcrumb',
  standalone: true,
  imports: [],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.part]': '"breadcrumb"',
  },
})
export class Breadcrumb {
  /**
   * Breadcrumb items. `item.href` is bound via `[href]`, so Angular's built-in
   * URL sanitizer applies (e.g. `javascript:` URLs are neutralized). Consumers
   * remain responsible for passing trusted/validated URLs, especially
   * user-generated ones.
   */
  items = input.required<BreadcrumbItem[]>();
  separator = input<string>('/');

  protected lastIndex = computed(() => this.items().length - 1);
}
