import { ComponentHarness } from '@angular/cdk/testing';

/** Harness for `mui-toggle` — role="switch" host, toggled via click or Space/Enter. */
export class MuiToggleHarness extends ComponentHarness {
  static hostSelector = 'mui-toggle';

  async isChecked(): Promise<boolean> {
    const host = await this.host();
    return (await host.getAttribute('aria-checked')) === 'true';
  }

  async isDisabled(): Promise<boolean> {
    const host = await this.host();
    return (await host.getAttribute('aria-disabled')) === 'true';
  }

  async getLabel(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('aria-label');
  }

  async getSize(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-size');
  }

  /** Clicks the toggle, flipping its checked state (unless disabled). */
  async toggle(): Promise<void> {
    const host = await this.host();
    await host.click();
  }

  async focus(): Promise<void> {
    const host = await this.host();
    await host.focus();
  }

  async isFocused(): Promise<boolean> {
    const host = await this.host();
    return host.isFocused();
  }
}
