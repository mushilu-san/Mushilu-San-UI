import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Harness for `<mui-typography>`.
 *
 * Purely presentational — the `variant` input is reflected as `data-variant` on the host, which
 * drives the CSS. There's no semantic role/element swap (see typography.ts): the host is always
 * `<mui-typography>` and callers are responsible for semantic markup inside/around it.
 */
export class MuiTypographyHarness extends ComponentHarness {
  static hostSelector = 'mui-typography';

  async getVariant(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-variant');
  }

  async getText(): Promise<string> {
    const host = await this.host();
    return (await host.text()).trim();
  }
}
