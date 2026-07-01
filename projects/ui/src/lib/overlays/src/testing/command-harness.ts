import { ComponentHarness, TestElement } from '@angular/cdk/testing';

export class MuiCommandHarness extends ComponentHarness {
  static hostSelector = 'mui-command';

  private readonly _input = this.locatorFor('[part="input"]');
  private readonly _allItems = this.locatorForAll('[data-command-item]');

  /** Types into the search input (does not clear existing text first). */
  async typeSearch(text: string): Promise<void> {
    const input = await this._input();
    await input.sendKeys(text);
  }

  /** Labels of the items currently visible (i.e. not filtered out by the search text). */
  async getVisibleItemLabels(): Promise<string[]> {
    const items = await this._visibleItems();
    return Promise.all(items.map((item) => item.text()));
  }

  /** Index, within the visible items, of the item that currently has focus — or -1 if none. */
  async getHighlightedIndex(): Promise<number> {
    const items = await this._visibleItems();
    for (let i = 0; i < items.length; i++) {
      if (await items[i].isFocused()) return i;
    }
    return -1;
  }

  private async _visibleItems(): Promise<TestElement[]> {
    const items = await this._allItems();
    const dimensions = await Promise.all(items.map((item) => item.getDimensions()));
    return items.filter((_, i) => dimensions[i].width > 0 && dimensions[i].height > 0);
  }
}
