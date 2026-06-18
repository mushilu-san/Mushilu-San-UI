import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('Combobox — E2E focus/Escape/return-focus', () => {
  test('click trigger opens listbox', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-combobox--default');
    await frame.getByRole('button').first().click();
    await expect(frame.getByRole('listbox')).toBeVisible();
  });

  test('Escape closes listbox', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-combobox--default');
    await frame.getByRole('button').first().click();
    await expect(frame.getByRole('listbox')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(frame.getByRole('listbox')).not.toBeVisible();
  });

  test('focus returns to trigger after Escape', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-combobox--default');
    const trigger = frame.getByRole('button').first();
    await trigger.click();
    await expect(frame.getByRole('listbox')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  });

  test('selecting an option closes listbox', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-combobox--default');
    await frame.getByRole('button').first().click();
    await expect(frame.getByRole('listbox')).toBeVisible();
    await frame.getByRole('option').first().click();
    await expect(frame.getByRole('listbox')).not.toBeVisible();
  });
});
