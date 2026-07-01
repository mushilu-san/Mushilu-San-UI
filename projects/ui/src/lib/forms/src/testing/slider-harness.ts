import { ComponentHarness, TestKey } from '@angular/cdk/testing';

export class MuiSliderHarness extends ComponentHarness {
  static hostSelector = 'mui-slider';

  private readonly _thumb = this.locatorFor('[part="thumb"]');

  async getValue(): Promise<number> {
    const thumb = await this._thumb();
    return Number(await thumb.getAttribute('aria-valuenow'));
  }

  async getMin(): Promise<number> {
    const thumb = await this._thumb();
    return Number(await thumb.getAttribute('aria-valuemin'));
  }

  async getMax(): Promise<number> {
    const thumb = await this._thumb();
    return Number(await thumb.getAttribute('aria-valuemax'));
  }

  async isDisabled(): Promise<boolean> {
    const thumb = await this._thumb();
    return (await thumb.getAttribute('aria-disabled')) === 'true';
  }

  async focus(): Promise<void> {
    const thumb = await this._thumb();
    await thumb.focus();
  }

  /** Moves the thumb one step via ArrowRight/ArrowLeft (assumes default step size). */
  async increment(steps = 1): Promise<void> {
    const thumb = await this._thumb();
    const key = steps >= 0 ? TestKey.RIGHT_ARROW : TestKey.LEFT_ARROW;
    for (let i = 0; i < Math.abs(steps); i++) {
      await thumb.sendKeys(key);
    }
  }

  async setToMin(): Promise<void> {
    const thumb = await this._thumb();
    await thumb.sendKeys(TestKey.HOME);
  }

  async setToMax(): Promise<void> {
    const thumb = await this._thumb();
    await thumb.sendKeys(TestKey.END);
  }
}
