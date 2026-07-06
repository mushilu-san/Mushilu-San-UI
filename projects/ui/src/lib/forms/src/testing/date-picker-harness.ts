import { ComponentHarness, TestKey } from '@angular/cdk/testing';

export class MuiDatePickerHarness extends ComponentHarness {
  static hostSelector = 'mui-date-picker';

  private readonly _trigger = this.locatorFor('.dp-trigger');
  private readonly _panel = this.locatorForOptional('.dp-panel');
  private readonly _display = this.locatorFor('.dp-display');
  private readonly _selectableDays = this.locatorForAll('.cal-day:not([aria-disabled="true"])');

  /** Opens the calendar panel by clicking the trigger, if not already open. */
  async open(): Promise<void> {
    if (await this.isOpen()) return;
    const trigger = await this._trigger();
    await trigger.click();
  }

  /** Closes the calendar panel via Escape, if open. */
  async close(): Promise<void> {
    if (!(await this.isOpen())) return;
    const trigger = await this._trigger();
    await trigger.sendKeys(TestKey.ESCAPE);
  }

  async isOpen(): Promise<boolean> {
    return (await this._panel()) !== null;
  }

  /** Text currently shown on the trigger (either the placeholder or the formatted date). */
  async getDisplayedValue(): Promise<string> {
    const display = await this._display();
    return (await display.text()).trim();
  }

  async isDisabled(): Promise<boolean> {
    const trigger = await this._trigger();
    return (await trigger.getAttribute('aria-disabled')) === 'true';
  }

  /** Clicks the first non-disabled day cell in the open calendar panel. Assumes the picker is open. */
  async selectFirstAvailableDay(): Promise<void> {
    const days = await this._selectableDays();
    const first = days[0];
    if (!first) throw new Error('No selectable day found in the open calendar panel');
    await first.click();
  }
}
