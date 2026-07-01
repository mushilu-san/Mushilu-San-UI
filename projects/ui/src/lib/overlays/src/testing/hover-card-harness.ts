import { ComponentHarness } from '@angular/cdk/testing';

export class MuiHoverCardHarness extends ComponentHarness {
  static hostSelector = 'mui-hover-card';

  // HoverCard's host doesn't expose a data-open attribute — open state is inferred from
  // whether the HoverCardContent panel (role="tooltip") is currently rendered.
  private readonly _panel = this.locatorForOptional('[part="panel"]');

  async isOpen(): Promise<boolean> {
    return (await this._panel()) !== null;
  }
}
