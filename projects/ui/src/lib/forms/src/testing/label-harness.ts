import { ComponentHarness } from '@angular/cdk/testing';

export class MuiLabelHarness extends ComponentHarness {
  static hostSelector = 'mui-label';

  private readonly _label = this.locatorFor('label');
  private readonly _requiredMark = this.locatorForOptional('.required-mark');

  async getText(): Promise<string> {
    const label = await this._label();
    return (await label.text()).trim();
  }

  /** The `for` attribute of the native `<label>` element, if any. */
  async getFor(): Promise<string | null> {
    const label = await this._label();
    return label.getAttribute('for');
  }

  async isRequired(): Promise<boolean> {
    return (await this._requiredMark()) !== null;
  }

  async isDisabled(): Promise<boolean> {
    const host = await this.host();
    return (await host.getAttribute('data-disabled')) !== null;
  }
}
