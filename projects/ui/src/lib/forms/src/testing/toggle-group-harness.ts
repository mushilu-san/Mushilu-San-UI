import { ComponentHarness } from '@angular/cdk/testing';

export class MuiToggleGroupHarness extends ComponentHarness {
  static hostSelector = 'mui-toggle-group';

  // `mui-toggle-group-item` hosts render `display: contents`, so the item host itself has no
  // clickable layout box — query it only for its static `value` attribute, and query the inner
  // `[part="button"]` (same DOM order, one-to-one) for the clickable/interactive state.
  private readonly _items = this.locatorForAll('mui-toggle-group-item');
  private readonly _buttons = this.locatorForAll('mui-toggle-group-item [part="button"]');

  /** `value` attribute of every item, in DOM order. */
  async getValues(): Promise<string[]> {
    const items = await this._items();
    return Promise.all(items.map(async (item) => (await item.getAttribute('value')) ?? ''));
  }

  /** Values of every item currently pressed (`aria-pressed="true"`). */
  async getSelectedValues(): Promise<string[]> {
    const values = await this.getValues();
    const buttons = await this._buttons();
    const selected: string[] = [];
    for (let i = 0; i < buttons.length; i++) {
      if ((await buttons[i].getAttribute('aria-pressed')) === 'true') {
        selected.push(values[i]);
      }
    }
    return selected;
  }

  /** Clicks the item with the given `value`. Throws if none matches. */
  async selectItem(value: string): Promise<void> {
    const values = await this.getValues();
    const idx = values.indexOf(value);
    if (idx === -1) throw new Error(`No toggle-group item found with value "${value}"`);
    const buttons = await this._buttons();
    await buttons[idx].click();
  }

  /** Whether the item with the given `value` is `aria-disabled`. Throws if none matches. */
  async isDisabled(value: string): Promise<boolean> {
    const values = await this.getValues();
    const idx = values.indexOf(value);
    if (idx === -1) throw new Error(`No toggle-group item found with value "${value}"`);
    const buttons = await this._buttons();
    return (await buttons[idx].getAttribute('aria-disabled')) === 'true';
  }
}
