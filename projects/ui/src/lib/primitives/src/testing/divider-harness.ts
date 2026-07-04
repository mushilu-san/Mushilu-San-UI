import { ComponentHarness } from '@angular/cdk/testing';

export class MuiDividerHarness extends ComponentHarness {
  static hostSelector = 'mui-divider';

  async getRole(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('role');
  }

  async getOrientation(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('aria-orientation');
  }

  async getVariant(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-variant');
  }

  async getLabel(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('aria-label');
  }
}
