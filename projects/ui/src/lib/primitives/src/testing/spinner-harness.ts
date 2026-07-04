import { ComponentHarness } from '@angular/cdk/testing';

export class MuiSpinnerHarness extends ComponentHarness {
  static hostSelector = 'mui-spinner';

  async getRole(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('role');
  }

  async getLabel(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('aria-label');
  }

  async getSize(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-size');
  }

  async getColor(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-color');
  }
}
