import { ComponentHarness } from '@angular/cdk/testing';

export class MuiFormFieldHarness extends ComponentHarness {
  static hostSelector = 'mui-form-field';

  private readonly _label = this.locatorForOptional('.field-label');
  private readonly _hint = this.locatorForOptional('.field-hint');
  private readonly _error = this.locatorForOptional('.field-error');
  private readonly _requiredMark = this.locatorForOptional('.required-mark');

  async getLabelText(): Promise<string | null> {
    const label = await this._label();
    return label ? (await label.text()).trim() : null;
  }

  async getHintText(): Promise<string | null> {
    const hint = await this._hint();
    return hint ? (await hint.text()).trim() : null;
  }

  async getErrorText(): Promise<string | null> {
    const error = await this._error();
    return error ? (await error.text()).trim() : null;
  }

  async hasHint(): Promise<boolean> {
    return (await this._hint()) !== null;
  }

  async hasError(): Promise<boolean> {
    return (await this._error()) !== null;
  }

  async isRequired(): Promise<boolean> {
    return (await this._requiredMark()) !== null;
  }

  async isInvalid(): Promise<boolean> {
    const host = await this.host();
    return (await host.getAttribute('data-invalid')) !== null;
  }

  async isDisabled(): Promise<boolean> {
    const host = await this.host();
    return (await host.getAttribute('data-disabled')) !== null;
  }
}
