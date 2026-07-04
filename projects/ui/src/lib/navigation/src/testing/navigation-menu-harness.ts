import { ComponentHarness, type TestElement } from '@angular/cdk/testing';

export class MuiNavigationMenuHarness extends ComponentHarness {
  static hostSelector = 'mui-navigation-menu';

  private readonly _triggers = this.locatorForAll('[muiNavMenuTrigger]');
  private readonly _openContent = this.locatorForOptional('[part="content"][data-open]');

  async getTriggerLabels(): Promise<string[]> {
    const triggers = await this._triggers();
    return Promise.all(triggers.map((t) => t.text()));
  }

  /** Whether any trigger's content panel is currently open. */
  async isOpen(): Promise<boolean> {
    return (await this._openContent()) !== null;
  }

  /** Clicks the trigger with the given visible label, toggling its content panel. */
  async openMenu(label: string): Promise<void> {
    const trigger = await this._getTriggerByLabel(label);
    await trigger.click();
  }

  async isMenuOpen(label: string): Promise<boolean> {
    const trigger = await this._getTriggerByLabel(label);
    return (await trigger.getAttribute('aria-expanded')) === 'true';
  }

  /** Text of the currently open content panel, or null if none is open. */
  async getOpenContentText(): Promise<string | null> {
    const content = await this._openContent();
    return content ? content.text() : null;
  }

  private async _getTriggerByLabel(label: string): Promise<TestElement> {
    const triggers = await this._triggers();
    for (const trigger of triggers) {
      if ((await trigger.text()) === label) return trigger;
    }
    throw new Error(`No navigation-menu trigger found with label "${label}"`);
  }
}
