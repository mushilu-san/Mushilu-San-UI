import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';
import { TABS_CONTEXT } from './tabs';

@Component({
  selector: 'mui-tab',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './tabs.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    role: 'tab',
    '[attr.aria-selected]': 'isActive()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.tabindex]': 'isActive() ? "0" : "-1"',
    '[attr.data-active]': 'isActive() ? "" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.id]': 'tabId()',
    '[attr.aria-controls]': 'panelId()',
    '[attr.part]': '"tab"',
  },
})
export class Tab {
  value = input.required<string>();
  disabled = input(false, { transform: booleanAttribute });

  protected ctx = inject(TABS_CONTEXT);
  protected isActive = computed(() => this.ctx.activeTab() === this.value());
  protected tabId = computed(() => `mui-tab-${this.value()}`);
  protected panelId = computed(() => `mui-tabpanel-${this.value()}`);

  @HostListener('click')
  onClick(): void {
    if (!this.disabled()) this.ctx.activeTab.set(this.value());
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: Event): void {
    const e = event as KeyboardEvent;
    if ((e.key === 'Enter' || e.key === ' ') && !this.disabled()) {
      e.preventDefault();
      this.ctx.activeTab.set(this.value());
    }
  }
}
