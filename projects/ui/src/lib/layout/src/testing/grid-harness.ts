import { ComponentHarness } from '@angular/cdk/testing';

export class MuiGridHarness extends ComponentHarness {
  static hostSelector = 'mui-grid';

  /** Number of rendered grid tracks (columns), derived from the computed `grid-template-columns`. */
  async getColumnCount(): Promise<number> {
    const host = await this.host();
    const value = await host.getCssValue('grid-template-columns');
    return value.trim().split(/\s+/).filter(Boolean).length;
  }

  async getColumnGap(): Promise<string> {
    const host = await this.host();
    return host.getCssValue('column-gap');
  }

  async getRowGap(): Promise<string> {
    const host = await this.host();
    return host.getCssValue('row-gap');
  }
}
