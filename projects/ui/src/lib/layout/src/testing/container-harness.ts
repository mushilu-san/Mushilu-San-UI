import { ComponentHarness } from '@angular/cdk/testing';

export class MuiContainerHarness extends ComponentHarness {
  static hostSelector = 'mui-container';

  /** The active `size` input, read off `data-size`. */
  async getSize(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-size');
  }

  /** Whether the container applies inline padding (`data-padded` is present). */
  async isPadded(): Promise<boolean> {
    const host = await this.host();
    return (await host.getAttribute('data-padded')) !== null;
  }
}
