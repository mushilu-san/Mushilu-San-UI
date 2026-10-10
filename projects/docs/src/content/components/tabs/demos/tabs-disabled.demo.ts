import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Tab, TabList, TabPanel, Tabs } from '@mushilu-san/ui/navigation';

@Component({
  selector: 'docs-tabs-disabled-demo',
  imports: [Tabs, TabList, Tab, TabPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mui-tabs activeTab="dis-overview">
      <mui-tab-list aria-label="Project">
        <mui-tab value="dis-overview">Overview</mui-tab>
        <mui-tab value="dis-reports" disabled>Reports</mui-tab>
        <mui-tab value="dis-members">Members</mui-tab>
      </mui-tab-list>
      <mui-tab-panel value="dis-overview">Project summary.</mui-tab-panel>
      <mui-tab-panel value="dis-reports">Reports are available on paid plans.</mui-tab-panel>
      <mui-tab-panel value="dis-members">Invite and manage members.</mui-tab-panel>
    </mui-tabs>
  `,
})
export class TabsDisabledDemo {}
