import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  ViewEncapsulation,
  model,
  input,
} from '@angular/core';
import type { TabsOrientation } from './tabs.types';

export const TABS_CONTEXT = new InjectionToken<Tabs>('TABS_CONTEXT');

// Module counter: gives each <mui-tabs> a unique id prefix so tab/panel ids
// stay unique when several Tabs on one page share values (A-7, #686).
let nextTabsUid = 0;

@Component({
  selector: 'mui-tabs',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './tabs.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.data-orientation]': 'orientation()',
    '[attr.part]': '"tabs"',
  },
  providers: [{ provide: TABS_CONTEXT, useExisting: Tabs }],
})
export class Tabs {
  activeTab = model<string>('');
  orientation = input<TabsOrientation>('horizontal');
  readonly uid = `t${++nextTabsUid}`;
}
