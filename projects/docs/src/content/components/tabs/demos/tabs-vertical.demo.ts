import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Tab, TabList, TabPanel, Tabs } from '@mushilu-san/ui/navigation';

@Component({
  selector: 'docs-tabs-vertical-demo',
  imports: [Tabs, TabList, Tab, TabPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    mui-tabs {
      display: flex;
      gap: var(--mui-space-4);
    }
    mui-tab-list {
      min-width: 140px;
    }
  `,
  template: `
    <mui-tabs activeTab="vert-profile" orientation="vertical">
      <mui-tab-list aria-label="Profile sections">
        <mui-tab value="vert-profile">Profile</mui-tab>
        <mui-tab value="vert-notifications">Notifications</mui-tab>
        <mui-tab value="vert-security">Security</mui-tab>
      </mui-tab-list>
      <div>
        <mui-tab-panel value="vert-profile">Public profile details.</mui-tab-panel>
        <mui-tab-panel value="vert-notifications">Email and push preferences.</mui-tab-panel>
        <mui-tab-panel value="vert-security">Sessions and connected devices.</mui-tab-panel>
      </div>
    </mui-tabs>
  `,
})
export class TabsVerticalDemo {}
