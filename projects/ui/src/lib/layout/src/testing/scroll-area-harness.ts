import { ComponentHarness } from '@angular/cdk/testing';

export class MuiScrollAreaHarness extends ComponentHarness {
  static hostSelector = 'mui-scroll-area';

  private readonly _viewport = this.locatorFor('[part="viewport"]');

  async getOrientation(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-orientation');
  }

  async getScrollTop(): Promise<number> {
    const viewport = await this._viewport();
    return viewport.getProperty<number>('scrollTop');
  }

  async getScrollLeft(): Promise<number> {
    const viewport = await this._viewport();
    return viewport.getProperty<number>('scrollLeft');
  }

  async getScrollHeight(): Promise<number> {
    const viewport = await this._viewport();
    return viewport.getProperty<number>('scrollHeight');
  }

  async getClientHeight(): Promise<number> {
    const viewport = await this._viewport();
    return viewport.getProperty<number>('clientHeight');
  }
}
