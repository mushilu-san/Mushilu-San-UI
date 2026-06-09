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
  items = input.required<BreadcrumbItem[]>();
  separator = input<string>('/');

  protected lastIndex = computed(() => this.items().length - 1);
}
