import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
  input,
} from '@angular/core';
import { TABS_CONTEXT } from './tabs';

@Component({
  selector: 'mui-tab-panel',
  standalone: true,
  imports: [],
  template: '@if (isActive()) { <ng-content /> }',
  styleUrl: './tabs.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    role: 'tabpanel',
    '[attr.id]': 'panelId()',
    '[attr.aria-labelledby]': 'tabId()',
    '[attr.tabindex]': '0',
    '[attr.hidden]': 'isActive() ? null : ""',
    '[attr.part]': '"tab-panel"',
  },
})
export class TabPanel {
  value = input.required<string>();

  private ctx = inject(TABS_CONTEXT);
  protected isActive = computed(() => this.ctx.activeTab() === this.value());
  protected panelId = computed(() => `mui-tabpanel-${this.value()}`);
  protected tabId = computed(() => `mui-tab-${this.value()}`);
}
