import { ComponentHarness } from '@angular/cdk/testing';

export class MuiSwipeActionHarness extends ComponentHarness {
  static hostSelector = 'mui-swipe-action';

  private readonly _actionButtons = this.locatorForAll('[part="action"]');

  /** Reads the host's `data-revealed` attribute, set by the component when a rail is snapped open. */
  async getRevealedSide(): Promise<'left' | 'right' | null> {
    const host = await this.host();
    const value = await host.getAttribute('data-revealed');
    return value === 'left' || value === 'right' ? value : null;
  }

  async isRevealed(): Promise<boolean> {
    return (await this.getRevealedSide()) !== null;
  }

  /** Clicks the revealed rail's action button matching `label` (case-insensitive exact match). */
  async clickAction(label: string): Promise<void> {
    const buttons = await this._actionButtons();
    for (const button of buttons) {
      const text = (await button.text()).trim();
      if (text.toLowerCase() === label.toLowerCase()) {
        await button.click();
        return;
      }
    }
    throw new Error(`MuiSwipeActionHarness: no action button labeled "${label}"`);
  }
}
