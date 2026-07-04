import { ComponentHarness } from '@angular/cdk/testing';

export class MuiButtonHarness extends ComponentHarness {
  static hostSelector = 'button[muiButton], a[muiButton]';

  async isDisabled(): Promise<boolean> {
    const host = await this.host();
    return (await host.getAttribute('aria-disabled')) === 'true';
  }

  async isLoading(): Promise<boolean> {
    const host = await this.host();
    return (await host.getAttribute('aria-busy')) === 'true';
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
    return (await host.text()).trim();
  }

  async click(): Promise<void> {
    const host = await this.host();
    await host.click();
  }
}
