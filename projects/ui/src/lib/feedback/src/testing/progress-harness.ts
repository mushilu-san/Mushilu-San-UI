import { ComponentHarness } from '@angular/cdk/testing';

export class MuiProgressHarness extends ComponentHarness {
  static hostSelector = 'mui-progress';

  /** null when indeterminate (the attribute is omitted entirely). */
  async getValueNow(): Promise<number | null> {
    const host = await this.host();
    const attr = await host.getAttribute('aria-valuenow');
    return attr === null ? null : Number(attr);
  }

  /** null when indeterminate (the attribute is omitted entirely). */
  async getValueMin(): Promise<number | null> {
    const host = await this.host();
    const attr = await host.getAttribute('aria-valuemin');
    return attr === null ? null : Number(attr);
  }

  /** null when indeterminate (the attribute is omitted entirely). */
  async getValueMax(): Promise<number | null> {
    const host = await this.host();
    const attr = await host.getAttribute('aria-valuemax');
    return attr === null ? null : Number(attr);
  }

  async isIndeterminate(): Promise<boolean> {
    const host = await this.host();
    return (await host.getAttribute('data-indeterminate')) !== null;
  }

  async isBusy(): Promise<boolean> {
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

  async getLabel(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('aria-label');
  }
}
