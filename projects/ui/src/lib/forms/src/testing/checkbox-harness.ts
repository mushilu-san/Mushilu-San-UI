import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Harness for `input[type=checkbox][muiCheckbox]` — Checkbox is an attribute-selector
 * component whose host IS the native `<input>` element, so all state lives on the native
 * `checked`/`disabled` DOM properties plus the `data-size`/`data-invalid` host attributes.
 */
export class MuiCheckboxHarness extends ComponentHarness {
  static hostSelector = 'input[type="checkbox"][muiCheckbox]';

  async isChecked(): Promise<boolean> {
    const host = await this.host();
    return host.getProperty<boolean>('checked');
  }

  async isDisabled(): Promise<boolean> {
    const host = await this.host();
    return host.getProperty<boolean>('disabled');
  }

  async isInvalid(): Promise<boolean> {
    const host = await this.host();
    return (await host.getAttribute('data-invalid')) === 'true';
  }

  async getSize(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-size');
  }

  /** Clicks the checkbox, flipping its checked state (unless disabled). */
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
