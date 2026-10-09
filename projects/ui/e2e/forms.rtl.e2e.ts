import { test, expect } from '@playwright/test';
import { gotoStoryRtl } from './helpers/rtl';

test.describe('Forms — RTL keyboard', () => {
  test('Slider: ArrowLeft increases and ArrowRight decreases the value', async ({ page }) => {
    const frame = await gotoStoryRtl(page, 'forms-slider--default');
    const thumb = frame.locator('[role="slider"]');
    const value = async () => Number(await thumb.getAttribute('aria-valuenow'));
    await thumb.focus();
    // End pins the value to max so the assertions do not depend on the story's initial value.
    await page.keyboard.press('End');
    await expect.poll(value).toBe(100);
    await page.keyboard.press('ArrowRight');
    await expect.poll(value).toBe(99);
    await page.keyboard.press('ArrowLeft');
    await expect.poll(value).toBe(100);
  });

  test('Calendar: ArrowLeft moves to the next day, ArrowRight to the previous', async ({
    page,
  }) => {
    const frame = await gotoStoryRtl(page, 'forms-calendar--with-selected-date');
    // The roving-tabindex day (tabindex="0") is the focused day.
    const activeDay = frame.locator('[part="day"][tabindex="0"]');
    const activeLabel = () => activeDay.getAttribute('aria-label');
    await activeDay.focus();
    const start = await activeLabel();
    await page.keyboard.press('ArrowLeft');
    await expect.poll(activeLabel).not.toBe(start);
    await expect(activeDay).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect.poll(activeLabel).toBe(start);
  });

  test('InputOtp: ArrowLeft moves to the next slot, ArrowRight to the previous', async ({
    page,
  }) => {
    const frame = await gotoStoryRtl(page, 'forms-inputotp--default');
    const slots = frame.locator('input.otp-slot');
    await slots.nth(1).focus();
    await page.keyboard.press('ArrowLeft');
    await expect(slots.nth(2)).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(slots.nth(1)).toBeFocused();
  });
});
