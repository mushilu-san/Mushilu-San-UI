import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
  input,
  model,
} from '@angular/core';
import { SIDEBAR_CONTEXT, SidebarContext } from './sidebar-context';

@Component({
  selector: 'mui-sidebar',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    {
      provide: SIDEBAR_CONTEXT,
      useExisting: forwardRef(() => Sidebar),
    },
  ],
  host: {
    'role':                  'navigation',
    '[attr.aria-label]':     'label()',
    '[attr.data-expanded]':  'expanded() ? "" : null',
    '[attr.data-collapsed]': '!expanded() ? "" : null',
    '[attr.part]':           '"root"',
  },
})
export class Sidebar implements SidebarContext {
  expanded = model(true);
  label    = input('Sidebar navigation');
  collapsible = input(true, { transform: booleanAttribute });

  toggle(): void {
    if (this.collapsible()) {
      this.expanded.update(v => !v);
    }
  }
}
