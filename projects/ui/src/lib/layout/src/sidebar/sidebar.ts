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
    role: 'navigation',
    '[attr.aria-label]': 'label()',
    '[attr.data-expanded]': 'expanded() ? "" : null',
    '[attr.data-collapsed]': '!expanded() ? "" : null',
    '[attr.part]': '"root"',
  },
})
export class Sidebar implements SidebarContext {
  /** Whether the sidebar shows its labels. Two-way bindable with `[(expanded)]`. */
  expanded = model(true);
  /** Accessible name of the navigation landmark. Default `Sidebar navigation`. */
  label = input('Sidebar navigation');
  /** Allows the trigger to collapse the sidebar. Default `true`. */
  collapsible = input(true, { transform: booleanAttribute });

  toggle(): void {
    if (this.collapsible()) {
      this.expanded.update((v) => !v);
    }
  }
}
