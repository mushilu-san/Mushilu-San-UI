import { ComponentHarness, HarnessPredicate, type BaseHarnessFilters } from '@angular/cdk/testing';

export interface RadioHarnessFilters extends BaseHarnessFilters {
  /** Filters to a radio whose `value` DOM property matches exactly. */
  value?: string;
}

/**
 * Harness for `input[type=radio][muiRadio]` — Radio is an attribute-selector component
 * whose host IS the native `<input>` element. Stories render multiple radios sharing a
 * `name`, so use `.with({ value })` via `getHarness`/`getAllHarnesses` to target one.
 */
export class MuiRadioHarness extends ComponentHarness {
  static hostSelector = 'input[type="radio"][muiRadio]';

  static with(options: RadioHarnessFilters = {}): HarnessPredicate<MuiRadioHarness> {
    return new HarnessPredicate(MuiRadioHarness, options).addOption(
      'value',
      options.value,
      async (harness, value) => (await harness.getValue()) === value,
    );
  }

  async getValue(): Promise<string> {
    const host = await this.host();
    return host.getProperty<string>('value');
  }

  async getName(): Promise<string> {
    const host = await this.host();
    return host.getProperty<string>('name');
  }

  async isChecked(): Promise<boolean> {
    const host = await this.host();
    return host.getProperty<boolean>('checked');
  }

  async isDisabled(): Promise<boolean> {
    const host = await this.host();
    return host.getProperty<boolean>('disabled');
  }

  async getSize(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-size');
  }

  /** Clicks the radio, selecting it (radios cannot be unchecked via click). */
  async select(): Promise<void> {
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
