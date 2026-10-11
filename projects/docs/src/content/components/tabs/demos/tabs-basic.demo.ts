import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Tab, TabList, TabPanel, Tabs } from '@mushilu-san/ui/navigation';

@Component({
  selector: 'docs-tabs-basic-demo',
  imports: [Tabs, TabList, Tab, TabPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mui-tabs activeTab="basic-account">
      <mui-tab-list aria-label="Account settings">
        <mui-tab value="basic-account">Account</mui-tab>
        <mui-tab value="basic-password">Password</mui-tab>
        <mui-tab value="basic-billing">Billing</mui-tab>
      </mui-tab-list>
      <mui-tab-panel value="basic-account">Update your name and email address.</mui-tab-panel>
      <mui-tab-panel value="basic-password"
        >Change your password and enable two-factor sign-in.</mui-tab-panel
      >
      <mui-tab-panel value="basic-billing">Manage your plan and payment method.</mui-tab-panel>
    </mui-tabs>
  `,
})
export class TabsBasicDemo {}
