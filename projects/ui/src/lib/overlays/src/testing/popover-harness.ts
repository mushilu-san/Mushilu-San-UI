import { ComponentHarness } from '@angular/cdk/testing';

export class MuiPopoverHarness extends ComponentHarness {
  static hostSelector = 'mui-popover';

  async isOpen(): Promise<boolean> {
    const host = await this.host();
    return (await host.getAttribute('data-open')) !== null;
  }
}
