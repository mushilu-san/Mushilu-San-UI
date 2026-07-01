import { ComponentHarness } from '@angular/cdk/testing';

export class MuiDropdownMenuHarness extends ComponentHarness {
  static hostSelector = 'mui-dropdown-menu';

  private readonly _items = this.locatorForAll('[role="menuitem"]');

  async isOpen(): Promise<boolean> {
    const host = await this.host();
    return (await host.getAttribute('data-open')) !== null;
  }

  async getItemLabels(): Promise<string[]> {
    const items = await this._items();
    return Promise.all(items.map((item) => item.text()));
  }

  /** Index of the menu item that currently has focus (roving tabindex) — or -1 if none. */
  async getFocusedItemIndex(): Promise<number> {
    const items = await this._items();
    for (let i = 0; i < items.length; i++) {
      if (await items[i].isFocused()) return i;
    }
    return -1;
  }
}
