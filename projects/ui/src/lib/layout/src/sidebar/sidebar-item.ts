import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';
import { SIDEBAR_CONTEXT } from './sidebar-context';

@Component({
  selector: 'a[muiSidebarItem], button[muiSidebarItem]',
  standalone: true,
  templateUrl: './sidebar-item.html',
  styleUrl: './sidebar-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.aria-current]': 'active() ? "page" : null',
    '[attr.data-active]': 'active() ? "" : null',
    '[attr.data-expanded]': 'expanded() ? "" : null',
    '[attr.part]': '"item"',
    '[attr.title]': '!expanded() && label() ? label() : null',
  },
})
export class SidebarItem {
  label = input('');
  active = input(false, { transform: booleanAttribute });

  private readonly ctx = inject(SIDEBAR_CONTEXT);
  protected readonly expanded = computed(() => this.ctx.expanded());
}
