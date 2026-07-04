import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Harness for `<mui-empty>`.
 *
 * Title/description are optional `[part]`-tagged elements only rendered when the corresponding
 * input is set, so their locators are optional. The action region (`[part="action"]`) always
 * renders (it's the `[slot=action]` projection target) even when no action content is projected.
 */
export class MuiEmptyHarness extends ComponentHarness {
  static hostSelector = 'mui-empty';

  private readonly _title = this.locatorForOptional('[part="title"]');
  private readonly _description = this.locatorForOptional('[part="description"]');
  private readonly _action = this.locatorFor('[part="action"]');

  async getRole(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('role');
  }

  async getTitle(): Promise<string | null> {
    const el = await this._title();
    return el ? (await el.text()).trim() : null;
  }

  async getDescription(): Promise<string | null> {
    const el = await this._description();
    return el ? (await el.text()).trim() : null;
  }

  async hasActionContent(): Promise<boolean> {
    const action = await this._action();
    return (await action.text()).trim().length > 0;
  }
}
