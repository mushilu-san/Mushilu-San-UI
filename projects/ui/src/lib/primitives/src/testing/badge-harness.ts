import { ComponentHarness } from '@angular/cdk/testing';

export class MuiBadgeHarness extends ComponentHarness {
  static hostSelector = 'mui-badge';

  async getVariant(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-variant');
  }

  async getSize(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-size');
  }

  async isDot(): Promise<boolean> {
    const host = await this.host();
    return (await host.getAttribute('data-dot')) !== null;
  }

  async getLabel(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('aria-label');
  }

  /** True for a dot badge with no label (purely decorative). */
  async isAriaHidden(): Promise<boolean> {
    const host = await this.host();
    return (await host.getAttribute('aria-hidden')) === 'true';
  }

  async getText(): Promise<string> {
    const host = await this.host();
    return (await host.text()).trim();
  }
}
