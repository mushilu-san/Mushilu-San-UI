import { ComponentHarness } from '@angular/cdk/testing';

export class MuiNavLinkHarness extends ComponentHarness {
  static hostSelector = 'a[muiNavLink]';

  async isActive(): Promise<boolean> {
    const host = await this.host();
    return (await host.getAttribute('data-active')) !== null;
  }

  async getAriaCurrent(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('aria-current');
  }

  async getVariant(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-variant');
  }

  async getSize(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-size');
  }

  async getText(): Promise<string> {
    const host = await this.host();
    return host.text();
  }

  async click(): Promise<void> {
    const host = await this.host();
    await host.click();
  }
}
