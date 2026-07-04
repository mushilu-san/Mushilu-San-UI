import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Harness for `<mui-card>`.
 *
 * The card is purely a structural/state container — variant and clickable state are both
 * reflected as host attributes (`data-variant`, `data-clickable`) rather than child elements,
 * so this harness reads directly off the host rather than locating internal parts.
 */
export class MuiCardHarness extends ComponentHarness {
  static hostSelector = 'mui-card';

  async getVariant(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-variant');
  }

  async isClickable(): Promise<boolean> {
    const host = await this.host();
    return (await host.getAttribute('data-clickable')) !== null;
  }

  async getRole(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('role');
  }

  async click(): Promise<void> {
    const host = await this.host();
    await host.click();
  }
}
