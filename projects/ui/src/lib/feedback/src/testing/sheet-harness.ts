import { ComponentHarness } from '@angular/cdk/testing';

export class MuiSheetHarness extends ComponentHarness {
  static hostSelector = 'mui-sheet';

  private readonly _panel = this.locatorFor('[part="panel"]');
  private readonly _closeBtn = this.locatorForOptional('[part="close"]');

  /** Native `<dialog>` reflects the `open` attribute only while shown via showModal(). */
  async isOpen(): Promise<boolean> {
    const panel = await this._panel();
    return (await panel.getAttribute('open')) !== null;
  }

  async close(): Promise<void> {
    const btn = await this._closeBtn();
    if (!btn) return;
    await btn.click();
  }
}
