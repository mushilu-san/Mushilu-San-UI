import { ComponentHarness } from '@angular/cdk/testing';

export class MuiSidebarHarness extends ComponentHarness {
  static hostSelector = 'mui-sidebar';

  private readonly _trigger = this.locatorForOptional('[part="trigger"]');
  private readonly _items = this.locatorForAll('[part="item"]');

  /** Whether the sidebar is currently expanded (`data-expanded` is present). */
  async isExpanded(): Promise<boolean> {
    const host = await this.host();
    return (await host.getAttribute('data-expanded')) !== null;
  }

  async getLabel(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('aria-label');
  }

  /** Clicks the `SidebarTrigger` rendered inside this sidebar, if any. */
  async toggle(): Promise<void> {
    const trigger = await this._trigger();
    if (!trigger) throw new Error('MuiSidebarHarness: no [part="trigger"] found inside sidebar');
    await trigger.click();
  }

  async getItemCount(): Promise<number> {
    return (await this._items()).length;
  }

  /** aria-current of the item whose visible text matches `label`, or null if not found/not current. */
  async getItemAriaCurrent(label: string): Promise<string | null> {
    const items = await this._items();
    for (const item of items) {
      const text = (await item.text()).trim();
      if (text.includes(label)) {
        return item.getAttribute('aria-current');
      }
    }
    throw new Error(`MuiSidebarHarness: no item found with text "${label}"`);
  }
}
