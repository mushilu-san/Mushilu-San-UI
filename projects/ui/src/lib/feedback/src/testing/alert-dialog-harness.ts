import { ComponentHarness } from '@angular/cdk/testing';

export class MuiAlertDialogHarness extends ComponentHarness {
  static hostSelector = 'mui-alert-dialog';

  private readonly _panel = this.locatorFor('[part="panel"]');
  private readonly _title = this.locatorFor('[part="title"]');
  private readonly _cancelBtn = this.locatorFor('[part="cancel"]');
  private readonly _confirmBtn = this.locatorFor('[part="confirm"]');

  /** Native `<dialog>` reflects the `open` attribute only while shown via showModal(). */
  async isOpen(): Promise<boolean> {
    const panel = await this._panel();
    return (await panel.getAttribute('open')) !== null;
  }

  async getHeading(): Promise<string> {
    const title = await this._title();
    return (await title.text()).trim();
  }

  async cancel(): Promise<void> {
    const btn = await this._cancelBtn();
    await btn.click();
  }

  async confirm(): Promise<void> {
    const btn = await this._confirmBtn();
    await btn.click();
  }
}
