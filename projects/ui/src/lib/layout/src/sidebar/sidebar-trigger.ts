import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
} from '@angular/core';
import { SIDEBAR_CONTEXT } from './sidebar-context';

@Component({
  selector: 'button[muiSidebarTrigger]',
  standalone: true,
  templateUrl: './sidebar-trigger.html',
  styleUrl: './sidebar-trigger.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    type: 'button',
    '[attr.aria-expanded]': 'expanded()',
    '[attr.aria-label]': 'expanded() ? "Collapse sidebar" : "Expand sidebar"',
    '[attr.data-expanded]': 'expanded() ? "" : null',
    '[attr.part]': '"trigger"',
    '(click)': 'ctx.toggle()',
  },
})
export class SidebarTrigger {
  protected readonly ctx = inject(SIDEBAR_CONTEXT);
  protected readonly expanded = computed(() => this.ctx.expanded());
}
