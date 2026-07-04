import { ComponentHarness } from '@angular/cdk/testing';

export class MuiAlertHarness extends ComponentHarness {
  static hostSelector = 'mui-alert';

  private readonly _title = this.locatorForOptional('[part="title"]');
  private readonly _body = this.locatorFor('[part="body"]');
  private readonly _dismissBtn = this.locatorForOptional('[part="dismiss"]');

  /** The host's live-region role — "alert" (assertive) for warning/danger, "status" (polite) otherwise. */
  async getRole(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('role');
  }

  /** Severity variant driving the role/live-region mapping (info/success/warning/danger). */
  async getVariant(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-variant');
  }

  async getHeading(): Promise<string | null> {
    const el = await this._title();
    return el ? (await el.text()).trim() : null;
  }

  async getBody(): Promise<string> {
    const el = await this._body();
    return (await el.text()).trim();
  }

  async isDismissible(): Promise<boolean> {
    return (await this._dismissBtn()) !== null;
  }

  async dismiss(): Promise<void> {
    const btn = await this._dismissBtn();
    if (!btn) return;
    await btn.click();
  }
}
