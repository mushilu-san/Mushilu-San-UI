import { ComponentHarness } from '@angular/cdk/testing';

export class MuiSelectHarness extends ComponentHarness {
  static hostSelector = 'select[muiSelect]';

  private readonly _options = this.locatorForAll('option');

  /** Current value of the native `<select>` element. */
  async getValue(): Promise<string> {
    const host = await this.host();
    return host.getProperty<string>('value');
  }

  /** Selects the `<option>` with the given `value` attribute. Throws if none matches. */
  async selectOption(value: string): Promise<void> {
    const options = await this._options();
    for (let i = 0; i < options.length; i++) {
      if ((await options[i].getProperty<string>('value')) === value) {
        const host = await this.host();
        await host.selectOptions(i);
        return;
      }
    }
    throw new Error(`No option found with value "${value}"`);
  }

  async isDisabled(): Promise<boolean> {
    const host = await this.host();
    return (await host.getProperty<boolean>('disabled')) === true;
  }

  /** Whether the select is marked invalid via `data-invalid`. */
  async isInvalid(): Promise<boolean> {
    const host = await this.host();
    return (await host.getAttribute('data-invalid')) !== null;
  }

  async focus(): Promise<void> {
    const host = await this.host();
    await host.focus();
  }
}
