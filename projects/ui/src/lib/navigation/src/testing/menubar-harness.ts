import { ComponentHarness, type TestElement } from '@angular/cdk/testing';

export class MuiMenubarHarness extends ComponentHarness {
  static hostSelector = 'mui-menubar';

  private readonly _triggers = this.locatorForAll('[muiMenubarTrigger]');
  private readonly _openContent = this.locatorForOptional('[part="content"][data-open]');
  private readonly _openItems = this.locatorForAll('[part="content"][data-open] [muiMenubarItem]');

  async getTriggerLabels(): Promise<string[]> {
    const triggers = await this._triggers();
    return Promise.all(triggers.map((t) => t.text()));
  }

  /** Whether any menu is currently open. */
  async isOpen(): Promise<boolean> {
    return (await this._openContent()) !== null;
  }

  /** Clicks the trigger with the given visible label, toggling its menu. */
  async openMenu(label: string): Promise<void> {
    const trigger = await this._getTriggerByLabel(label);
    await trigger.click();
  }

  async isMenuOpen(label: string): Promise<boolean> {
    const trigger = await this._getTriggerByLabel(label);
    return (await trigger.getAttribute('aria-expanded')) === 'true';
  }

  /** Visible item labels inside the currently open menu content (empty if none open). */
  async getOpenItemLabels(): Promise<string[]> {
    const items = await this._openItems();
    return Promise.all(items.map((item) => item.text()));
  }

  /** Index of the item that currently has focus within the open menu content — or -1. */
  async getFocusedItemIndex(): Promise<number> {
    const items = await this._openItems();
    for (let i = 0; i < items.length; i++) {
      if (await items[i].isFocused()) return i;
    }
    return -1;
  }

  private async _getTriggerByLabel(label: string): Promise<TestElement> {
    const triggers = await this._triggers();
    for (const trigger of triggers) {
      if ((await trigger.text()) === label) return trigger;
    }
    throw new Error(`No menubar trigger found with label "${label}"`);
  }
}
