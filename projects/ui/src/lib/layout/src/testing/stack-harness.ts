import { ComponentHarness } from '@angular/cdk/testing';

export class MuiStackHarness extends ComponentHarness {
  static hostSelector = 'mui-stack';

  async getDirection(): Promise<string> {
    const host = await this.host();
    return host.getCssValue('flex-direction');
  }

  async getGap(): Promise<string> {
    const host = await this.host();
    return host.getCssValue('gap');
  }

  async getAlignItems(): Promise<string> {
    const host = await this.host();
    return host.getCssValue('align-items');
  }

  async getJustifyContent(): Promise<string> {
    const host = await this.host();
    return host.getCssValue('justify-content');
  }
}
