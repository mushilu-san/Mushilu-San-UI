import { ComponentHarness } from '@angular/cdk/testing';

export class MuiToastHarness extends ComponentHarness {
  static hostSelector = 'mui-toast';

  private readonly _message = this.locatorFor('[part="message"]');
  private readonly _title = this.locatorForOptional('[part="title"]');
  private readonly _dismissBtn = this.locatorFor('[part="dismiss"]');

  async getMessage(): Promise<string> {
    const el = await this._message();
    return (await el.text()).trim();
  }

  async getHeading(): Promise<string | null> {
    const el = await this._title();
    return el ? (await el.text()).trim() : null;
  }

  /** Drives the toast's live-region politeness (info/success = polite, warning/danger = assertive). */
  async getVariant(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-variant');
  }

  async dismiss(): Promise<void> {
    const btn = await this._dismissBtn();
    await btn.click();
  }
}
