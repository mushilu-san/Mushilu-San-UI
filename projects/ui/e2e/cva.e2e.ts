import { expect, test } from '@playwright/test';
import { gotoStory } from './helpers/story';

// E-3: CVA round-trip — InputOtp two-way value binding (real-browser path)
// FormControl writeValue/registerOnTouched/setDisabledState are covered by unit tests.
test.describe('CVA round-trip — InputOtp value binding (E-3)', () => {
  test('value starts empty', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-input-otp--reactive-form-binding');
    await expect(frame.locator('#ctrl-value')).toContainText('""');
  });

  test('typing into slots updates the bound value', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-input-otp--reactive-form-binding');
    const firstSlot = frame.locator('.otp-slot').first();
    await firstSlot.click();
    await page.keyboard.type('1234');
    await expect(frame.locator('#ctrl-value')).toContainText('"1234"');
  });

  test('partial entry reflects in the bound value', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-input-otp--reactive-form-binding');
    const firstSlot = frame.locator('.otp-slot').first();
    await firstSlot.click();
    await page.keyboard.type('42');
    await expect(frame.locator('#ctrl-value')).toContainText('"42"');
  });

  test('otp slots are not aria-disabled by default', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-input-otp--reactive-form-binding');
    const firstSlot = frame.locator('.otp-slot').first();
    await expect(firstSlot).not.toHaveAttribute('aria-disabled');
  });

  test('Backspace clears the last entered digit', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-input-otp--reactive-form-binding');
    const firstSlot = frame.locator('.otp-slot').first();
    await firstSlot.click();
    await page.keyboard.type('12');
    await page.keyboard.press('Backspace');
    await expect(frame.locator('#ctrl-value')).toContainText('"1"');
  });
});
