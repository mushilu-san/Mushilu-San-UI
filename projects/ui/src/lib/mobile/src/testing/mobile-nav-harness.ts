import { ComponentHarness } from '@angular/cdk/testing';

export class MuiMobileNavHarness extends ComponentHarness {
  static hostSelector = 'mui-mobile-nav';

  private readonly _itemButtons = this.locatorForAll('[part="button"]');

  /** Text of the item button currently carrying `aria-current="page"`, or null if none. */
  async getActiveLabel(): Promise<string | null> {
    for (const button of await this._itemButtons()) {
      if ((await button.getAttribute('aria-current')) === 'page') {
        return (await button.text()).trim();
      }
    }
    return null;
  }

  /** Count of item buttons carrying `aria-current="page"` — should always be exactly 1. */
  async getActiveCount(): Promise<number> {
    let count = 0;
    for (const button of await this._itemButtons()) {
      if ((await button.getAttribute('aria-current')) === 'page') count++;
    }
    return count;
  }

  /** Clicks the item whose visible label ends with `label` (badge text, if any, precedes the label in the DOM). */
  async clickItem(label: string): Promise<void> {
    for (const button of await this._itemButtons()) {
      const text = (await button.text()).trim();
      if (text.endsWith(label)) {
        await button.click();
        return;
      }
    }
    throw new Error(`MuiMobileNavHarness: no item labeled "${label}"`);
  }
}
