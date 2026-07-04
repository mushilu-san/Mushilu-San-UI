import { ComponentHarness } from '@angular/cdk/testing';

export class MuiSpacerHarness extends ComponentHarness {
  static hostSelector = 'mui-spacer';

  /** True when the spacer is flexible (no fixed `size` — grows to fill available space). */
  async isFlexible(): Promise<boolean> {
    const host = await this.host();
    const flexGrow = await host.getCssValue('flex-grow');
    return Number(flexGrow) > 0;
  }

  /** Computed width — non-zero only when a fixed `size` is set. */
  async getWidth(): Promise<string> {
    const host = await this.host();
    return host.getCssValue('width');
  }
}
