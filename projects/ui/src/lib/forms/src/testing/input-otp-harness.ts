import { ComponentHarness } from '@angular/cdk/testing';

export class MuiInputOtpHarness extends ComponentHarness {
  static hostSelector = 'mui-input-otp';

  private readonly _slots = this.locatorForAll('[part="slot"]');

  /** Current value of every slot, left-to-right, in DOM order. */
  async getSlotValues(): Promise<string[]> {
    const slots = await this._slots();
    return Promise.all(slots.map((slot) => slot.getProperty<string>('value')));
  }

  /** Index of the slot that currently has focus, or -1 if none does. */
  async getFocusedSlotIndex(): Promise<number> {
    const slots = await this._slots();
    for (let i = 0; i < slots.length; i++) {
      if (await slots[i].isFocused()) return i;
    }
    return -1;
  }
}
