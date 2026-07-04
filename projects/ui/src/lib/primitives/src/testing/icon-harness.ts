import { ComponentHarness } from '@angular/cdk/testing';

export class MuiIconHarness extends ComponentHarness {
  static hostSelector = 'mui-icon';

  async getName(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-name');
  }

  async getSize(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-size');
  }

  async getColor(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-color');
  }

  async getLabel(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('aria-label');
  }

  async getRole(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('role');
  }

  /** True for purely decorative icons (no label → aria-hidden="true"). */
  async isDecorative(): Promise<boolean> {
    const host = await this.host();
    return (await host.getAttribute('aria-hidden')) === 'true';
  }
}
