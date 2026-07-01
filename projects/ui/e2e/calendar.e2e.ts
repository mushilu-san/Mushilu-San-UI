import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiCalendarHarness } from '../src/lib/forms/src/testing/calendar-harness';

test.describe('Calendar — E-7 keyboard navigation & selection', () => {
  test('renders a date grid', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-calendar--default');
    await expect(frame.getByRole('grid')).toBeVisible();
  });

  test('ArrowRight moves focus to next day', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(
      page,
      'forms-calendar--with-selected-date',
    );
    const calendar = await loader.getHarness(MuiCalendarHarness);
    // Focus the active (tabindex=0) day button and press ArrowRight
    const activeDay = frame.locator('button.cal-day[tabindex="0"]');
    await activeDay.focus();
    const initialLabel = await calendar.getFocusedDayLabel();
    await page.keyboard.press('ArrowRight');
    // Poll rather than read once: zoneless CD flushes to the DOM asynchronously and there's
    // no safe synchronous "wait until settled" for the Storybook iframe (see helpers/harness.ts).
    await expect.poll(() => calendar.getFocusedDayLabel()).not.toBe(initialLabel);
  });

  test('ArrowDown moves focus down one week', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(
      page,
      'forms-calendar--with-selected-date',
    );
    const calendar = await loader.getHarness(MuiCalendarHarness);
    const activeDay = frame.locator('button.cal-day[tabindex="0"]');
    await activeDay.focus();
    const initialLabel = await calendar.getFocusedDayLabel();
    await page.keyboard.press('ArrowDown');
    await expect.poll(() => calendar.getFocusedDayLabel()).not.toBe(initialLabel);
  });

  test('clicking Next Month advances the heading', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'forms-calendar--default');
    const calendar = await loader.getHarness(MuiCalendarHarness);
    const initial = await calendar.getHeadingText();
    await frame.getByRole('button', { name: /next month/i }).click();
    await expect.poll(() => calendar.getHeadingText()).not.toBe(initial);
  });

  test('clicking Previous Month goes back', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'forms-calendar--default');
    const calendar = await loader.getHarness(MuiCalendarHarness);
    const initial = await calendar.getHeadingText();
    await frame.getByRole('button', { name: /next month/i }).click();
    await expect.poll(() => calendar.getHeadingText()).not.toBe(initial); // wait for Next to render
    await frame.getByRole('button', { name: /previous month/i }).click();
    await expect.poll(() => calendar.getHeadingText()).toBe(initial); // back to starting month
  });

  test('clicking a day marks it aria-selected="true"', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'forms-calendar--default');
    const calendar = await loader.getHarness(MuiCalendarHarness);
    const days = frame.locator('button.cal-day:not([data-outside])');
    const target = days.nth(14); // 0-indexed → day 15
    const targetLabel = await target.getAttribute('aria-label');
    if (!targetLabel) throw new Error('Target day missing aria-label');
    await target.click();
    await expect.poll(() => calendar.getSelectedDayLabel()).toBe(targetLabel);
  });

  test('min/max story disables out-of-range days', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'forms-calendar--with-min-max-date');
    const calendar = await loader.getHarness(MuiCalendarHarness);
    // At least one day should be aria-disabled
    const disabledDay = frame.locator('button.cal-day[aria-disabled]').first();
    await expect(disabledDay).toBeVisible();
    const label = await disabledDay.getAttribute('aria-label');
    if (!label) throw new Error('Disabled day missing aria-label');
    expect(await calendar.isDayDisabled(label)).toBe(true);
  });

  test('PageDown navigates to next month', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'forms-calendar--default');
    const calendar = await loader.getHarness(MuiCalendarHarness);
    const initial = await calendar.getHeadingText();
    const activeDay = frame.locator('button.cal-day[tabindex="0"]');
    await activeDay.focus();
    await page.keyboard.press('PageDown');
    await expect.poll(() => calendar.getHeadingText()).not.toBe(initial);
  });
});
