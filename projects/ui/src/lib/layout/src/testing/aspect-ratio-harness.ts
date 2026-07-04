import { ComponentHarness } from '@angular/cdk/testing';

export class MuiAspectRatioHarness extends ComponentHarness {
  static hostSelector = 'mui-aspect-ratio';

  /** The configured width:height ratio, read off the `--_ratio` custom property. */
  async getRatio(): Promise<number> {
    const host = await this.host();
    return Number(await host.getCssValue('--_ratio'));
  }
}
