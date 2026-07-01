import { expect, test } from '@playwright/test';
import { gotoStory } from './helpers/story';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiInputOtpHarness } from '../src/lib/forms/src/testing/input-otp-harness';

// E-3: InputOtp user-interaction round-trip — real browser, real DOM
// Tests slot state after typing; value-emission & CVA paths covered by unit specs.
//
// Type the whole string in one page.keyboard.type() call, then poll once at the end. Polling
// the harness *between* keystrokes was tried and made things worse, not better: each poll does
// several CDP round-trips, and that overhead landing between native keydown events appears to
// perturb the zoneless CD scheduler's timing relative to InputOtp's focus-transfer in onInput().
// One uninterrupted type() call, matching how a real user or autofill types, is both simpler and
// more stable.
test.describe('InputOtp interaction — real browser (E-3)', () => {
  test('renders 4 slots with empty values on load', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(
      page,
      'forms-inputotp--reactive-form-binding',
    );
    const otp = await loader.getHarness(MuiInputOtpHarness);
    await expect(frame.locator('.otp-slot')).toHaveCount(4);
    expect(await otp.getSlotValues()).toEqual(['', '', '', '']);
  });

  test('typing fills slot values left-to-right', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(
      page,
      'forms-inputotp--reactive-form-binding',
    );
    const otp = await loader.getHarness(MuiInputOtpHarness);
    await frame.locator('.otp-slot').first().click();
    await page.keyboard.type('1234');
    await expect.poll(() => otp.getSlotValues()).toEqual(['1', '2', '3', '4']);
    await expect.poll(() => otp.getFocusedSlotIndex()).toBe(3);
  });

  test('partial entry leaves later slots empty', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(
      page,
      'forms-inputotp--reactive-form-binding',
    );
    const otp = await loader.getHarness(MuiInputOtpHarness);
    await frame.locator('.otp-slot').first().click();
    await page.keyboard.type('42');
    await expect.poll(() => otp.getSlotValues()).toEqual(['4', '2', '', '']);
    await expect.poll(() => otp.getFocusedSlotIndex()).toBe(2);
  });

  test('slots are not aria-disabled by default', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-inputotp--reactive-form-binding');
    const firstSlot = frame.locator('.otp-slot').first();
    await expect(firstSlot).toBeVisible();
    await expect(firstSlot).not.toHaveAttribute('aria-disabled');
  });

  test('Backspace on a filled slot clears it', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(
      page,
      'forms-inputotp--reactive-form-binding',
    );
    const otp = await loader.getHarness(MuiInputOtpHarness);
    const slot0 = frame.locator('.otp-slot').first();
    await slot0.click();
    await page.keyboard.type('1');
    await expect.poll(async () => (await otp.getSlotValues())[0]).toBe('1');
    await slot0.click(); // re-focus slot 0 so Backspace targets the filled slot
    await page.keyboard.press('Backspace');
    await expect.poll(async () => (await otp.getSlotValues())[0]).toBe('');
  });

  test('B-10: zero-delay typing does not drop or misroute digits', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(
      page,
      'forms-inputotp--reactive-form-binding',
    );
    const otp = await loader.getHarness(MuiInputOtpHarness);
    await frame.locator('.otp-slot').first().click();
    // delay: 0 reproduced a stale-closure race in onFocus()'s deferred select() call, which
    // could yank focus back to an earlier slot mid-typing and misroute later keystrokes.
    await page.keyboard.type('1234', { delay: 0 });
    await expect.poll(() => otp.getSlotValues()).toEqual(['1', '2', '3', '4']);
  });
});
