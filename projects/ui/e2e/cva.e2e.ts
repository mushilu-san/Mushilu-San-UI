import { expect, test } from '@playwright/test';
import { gotoStory } from './helpers/story';

// E-3: CVA round-trip — InputOtp bound to a ReactiveFormsModule FormControl
test.describe('CVA round-trip — InputOtp + FormControl (E-3)', () => {
  test('FormControl value starts empty', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-input-otp--reactive-form-binding');
    await expect(frame.locator('#ctrl-value')).toContainText('""');
  });

  test('typing into slots updates FormControl value', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-input-otp--reactive-form-binding');
    const firstSlot = frame.locator('.otp-slot').first();
    await firstSlot.click();
    await page.keyboard.type('1234');
    await expect(frame.locator('#ctrl-value')).toContainText('"1234"');
  });

  test('partial entry reflects in FormControl value', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-input-otp--reactive-form-binding');
    const firstSlot = frame.locator('.otp-slot').first();
    await firstSlot.click();
    await page.keyboard.type('42');
    await expect(frame.locator('#ctrl-value')).toContainText('"42"');
  });

  test('blur marks FormControl as touched', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-input-otp--reactive-form-binding');
    await expect(frame.locator('#ctrl-touched')).toContainText('false');
    const firstSlot = frame.locator('.otp-slot').first();
    await firstSlot.click();
    await page.keyboard.press('Tab');
    await expect(frame.locator('#ctrl-touched')).toContainText('true');
  });

  test('control starts enabled', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-input-otp--reactive-form-binding');
    await expect(frame.locator('#ctrl-disabled')).toContainText('false');
    const firstSlot = frame.locator('.otp-slot').first();
    await expect(firstSlot).not.toHaveAttribute('aria-disabled');
  });

  test('Backspace clears last entered digit', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-input-otp--reactive-form-binding');
    const firstSlot = frame.locator('.otp-slot').first();
    await firstSlot.click();
    await page.keyboard.type('12');
    await page.keyboard.press('Backspace');
    await expect(frame.locator('#ctrl-value')).toContainText('"1"');
  });
});
