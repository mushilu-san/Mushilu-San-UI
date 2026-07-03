import { ComponentHarness } from '@angular/cdk/testing';

export class MuiAvatarHarness extends ComponentHarness {
  static hostSelector = 'mui-avatar';

  private readonly _image = this.locatorForOptional('.image');
  private readonly _fallback = this.locatorForOptional('.fallback');

  async getLabel(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('aria-label');
  }

  async getSize(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-size');
  }

  async getShape(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-shape');
  }

  /** True when the image is rendered (src set and not yet errored). */
  async isShowingImage(): Promise<boolean> {
    return (await this._image()) !== null;
  }

  /** True when the initials fallback is rendered instead of an image. */
  async isShowingFallback(): Promise<boolean> {
    return (await this._fallback()) !== null;
  }

  /** Text of the initials fallback, or null if an image is showing. */
  async getInitialsText(): Promise<string | null> {
    const fallback = await this._fallback();
    return fallback ? (await fallback.text()).trim() : null;
  }
}
