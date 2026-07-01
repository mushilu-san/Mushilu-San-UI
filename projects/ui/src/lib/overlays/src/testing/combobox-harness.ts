import { ComponentHarness } from '@angular/cdk/testing';

export class MuiComboboxHarness extends ComponentHarness {
  static hostSelector = 'mui-combobox';

  private readonly _trigger = this.locatorFor('[part="trigger"]');
  private readonly _options = this.locatorForAll('[role="option"]');

  async isOpen(): Promise<boolean> {
    const trigger = await this._trigger();
    return (await trigger.getAttribute('aria-expanded')) === 'true';
  }

  async open(): Promise<void> {
    const trigger = await this._trigger();
    await trigger.click();
  }

  async getOptionLabels(): Promise<string[]> {
    const options = await this._options();
    return Promise.all(options.map((option) => option.text()));
  }

  /** Whether the option whose text matches `label` currently has aria-selected="true". */
  async isOptionSelected(label: string | RegExp): Promise<boolean> {
    const options = await this._options();
    for (const option of options) {
      const text = (await option.text()).trim();
      const matches = typeof label === 'string' ? text === label : label.test(text);
      if (matches) return (await option.getAttribute('aria-selected')) === 'true';
    }
    return false;
  }
}
