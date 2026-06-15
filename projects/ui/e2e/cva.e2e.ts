import { expect, test } from '@playwright/test';
import { gotoStory } from './helpers/story';

// E-3: InputOtp user-interaction round-trip — real browser, real DOM
// Tests slot state after typing; value-emission & CVA paths covered by unit specs.
test.describe('InputOtp interaction — real browser (E-3)', () => {
  test('renders 4 slots with empty values on load', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-inputotp--reactive-form-binding');
    const slots = frame.locator('.otp-slot');
    await expect(slots).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      expect(await slots.nth(i).inputValue()).toBe('');
    }
  });

  test('typing fills slot values left-to-right', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-inputotp--reactive-form-binding');
    await frame.locator('.otp-slot').first().click();
    await page.keyboard.type('1234');
    const slots = frame.locator('.otp-slot');
    expect(await slots.nth(0).inputValue()).toBe('1');
    expect(await slots.nth(1).inputValue()).toBe('2');
    expect(await slots.nth(2).inputValue()).toBe('3');
    expect(await slots.nth(3).inputValue()).toBe('4');
  });

  test('partial entry leaves later slots empty', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-inputotp--reactive-form-binding');
    await frame.locator('.otp-slot').first().click();
    await page.keyboard.type('42');
    const slots = frame.locator('.otp-slot');
    expect(await slots.nth(0).inputValue()).toBe('4');
    expect(await slots.nth(1).inputValue()).toBe('2');
    expect(await slots.nth(2).inputValue()).toBe('');
  });

  test('slots are not aria-disabled by default', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-inputotp--reactive-form-binding');
    const firstSlot = frame.locator('.otp-slot').first();
    await expect(firstSlot).toBeVisible();
    await expect(firstSlot).not.toHaveAttribute('aria-disabled');
  });

  test('Backspace on a filled slot clears it', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-inputotp--reactive-form-binding');
    const slot0 = frame.locator('.otp-slot').first();
    await slot0.click();
    await page.keyboard.type('1');
    await expect(slot0).toHaveValue('1'); // wait for Angular to flush '1' into DOM
    await slot0.click(); // re-focus slot 0 so Backspace targets the filled slot
    await page.keyboard.press('Backspace');
    await expect(slot0).toHaveValue('');
  });
});
