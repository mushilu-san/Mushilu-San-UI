import { ComponentHarness, type TestElement } from '@angular/cdk/testing';

export class MuiTabsHarness extends ComponentHarness {
  static hostSelector = 'mui-tabs';

  private readonly _tabs = this.locatorForAll('[role="tab"]');
  private readonly _panels = this.locatorForAll('[role="tabpanel"]');

  async getTabLabels(): Promise<string[]> {
    const tabs = await this._tabs();
    return Promise.all(tabs.map((tab) => tab.text()));
  }

  async getSelectedTabLabel(): Promise<string | null> {
    const tabs = await this._tabs();
    for (const tab of tabs) {
      if ((await tab.getAttribute('aria-selected')) === 'true') {
        return tab.text();
      }
    }
    return null;
  }

  async isTabSelected(label: string): Promise<boolean> {
    const tab = await this._getTabByLabel(label);
    return (await tab.getAttribute('aria-selected')) === 'true';
  }

  /** Clicks the tab with the given visible label, activating its panel. */
  async selectTab(label: string): Promise<void> {
    const tab = await this._getTabByLabel(label);
    await tab.click();
  }

  /** Text content of the currently visible (non-hidden) tab panel, or null if none. */
  async getVisiblePanelText(): Promise<string | null> {
    const panels = await this._panels();
    for (const panel of panels) {
      if ((await panel.getAttribute('hidden')) === null) {
        return panel.text();
      }
    }
    return null;
  }

  private async _getTabByLabel(label: string): Promise<TestElement> {
    const tabs = await this._tabs();
    for (const tab of tabs) {
      if ((await tab.text()) === label) return tab;
    }
    throw new Error(`No tab found with label "${label}"`);
  }
}
