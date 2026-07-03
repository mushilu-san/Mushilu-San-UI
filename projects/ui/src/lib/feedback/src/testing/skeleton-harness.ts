import { ComponentHarness } from '@angular/cdk/testing';

export class MuiSkeletonHarness extends ComponentHarness {
  static hostSelector = 'mui-skeleton';

  private readonly _items = this.locatorForAll('[part="item"]');

  async getVariant(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-variant');
  }

  /** Skeleton is purely decorative — always hidden; the surrounding region should carry aria-busy. */
  async isHiddenFromAssistiveTech(): Promise<boolean> {
    const host = await this.host();
    return (await host.getAttribute('aria-hidden')) === 'true';
  }

  /** Number of rendered placeholder items — one per `lines` for text, always one for rect/circle. */
  async getItemCount(): Promise<number> {
    return (await this._items()).length;
  }
}
