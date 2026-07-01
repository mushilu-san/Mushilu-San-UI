import { ComponentHarness } from '@angular/cdk/testing';

export class MuiCalendarHarness extends ComponentHarness {
  static hostSelector = 'mui-calendar';

  private readonly _heading = this.locatorFor('[role="heading"]');
  private readonly _focusedDay = this.locatorFor('[part="day"][tabindex="0"]');
  private readonly _selectedDay = this.locatorForOptional('[part="day"][aria-selected="true"]');
  private readonly _days = this.locatorForAll('[part="day"]');

  async getHeadingText(): Promise<string> {
    const heading = await this._heading();
    return (await heading.text()).trim();
  }

  /** aria-label of the day currently reachable via Tab (tabindex="0"). */
  async getFocusedDayLabel(): Promise<string | null> {
    const day = await this._focusedDay();
    return day.getAttribute('aria-label');
  }

  /** aria-label of the day marked aria-selected="true", or null if none. */
  async getSelectedDayLabel(): Promise<string | null> {
    const day = await this._selectedDay();
    return day ? day.getAttribute('aria-label') : null;
  }

  /** Whether the day with the given aria-label is aria-disabled. Throws if not found. */
  async isDayDisabled(label: string): Promise<boolean> {
    const days = await this._days();
    for (const day of days) {
      if ((await day.getAttribute('aria-label')) === label) {
        return (await day.getAttribute('aria-disabled')) === 'true';
      }
    }
    throw new Error(`No day found with aria-label "${label}"`);
  }
}
