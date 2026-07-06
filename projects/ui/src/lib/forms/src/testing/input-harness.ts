import { ComponentHarness } from '@angular/cdk/testing';

export class MuiInputHarness extends ComponentHarness {
  static hostSelector = 'input[muiInput]';

  async getValue(): Promise<string> {
    const host = await this.host();
    return host.getProperty<string>('value');
  }

  /** Clears any existing value and types the given text, dispatching real input events. */
  async setValue(text: string): Promise<void> {
    const host = await this.host();
    await host.clear();
    await host.sendKeys(text);
  }

  async isDisabled(): Promise<boolean> {
    const host = await this.host();
    return (await host.getProperty<boolean>('disabled')) === true;
  }

  async isInvalid(): Promise<boolean> {
    const host = await this.host();
    return (await host.getAttribute('data-invalid')) !== null;
  }

  async getSize(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-size');
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
