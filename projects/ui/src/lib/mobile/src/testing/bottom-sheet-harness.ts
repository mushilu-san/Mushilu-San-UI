import { ComponentHarness } from '@angular/cdk/testing';

export class MuiBottomSheetHarness extends ComponentHarness {
  static hostSelector = 'mui-bottom-sheet';

  private readonly _panel = this.locatorFor('[part="panel"]');
  private readonly _closeButton = this.locatorFor('[part="close"]');

  /** The native `<dialog>` reflects its `open` IDL attribute onto the `open` content attribute. */
  async isOpen(): Promise<boolean> {
    const panel = await this._panel();
    return (await panel.getAttribute('open')) !== null;
  }

  async close(): Promise<void> {
    const button = await this._closeButton();
    await button.click();
  }
}
