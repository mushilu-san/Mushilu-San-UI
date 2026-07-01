import { ComponentHarness } from '@angular/cdk/testing';

export class MuiFabHarness extends ComponentHarness {
  static hostSelector = 'mui-fab';

  private readonly _button = this.locatorFor('[part="button"]');

  async isDisabled(): Promise<boolean> {
    const button = await this._button();
    return (await button.getAttribute('aria-disabled')) === 'true';
  }

  async isLoading(): Promise<boolean> {
    const button = await this._button();
    return (await button.getAttribute('aria-busy')) === 'true';
  }

  async getLabel(): Promise<string | null> {
    const button = await this._button();
    return button.getAttribute('aria-label');
  }

  async click(): Promise<void> {
    const button = await this._button();
    await button.click();
  }
}
