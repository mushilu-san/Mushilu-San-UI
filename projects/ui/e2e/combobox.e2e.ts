import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('Combobox — E-7 open / select / Escape', () => {
  test('clicking trigger opens listbox', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-combobox--default');
    await frame.locator('button[aria-haspopup="listbox"]').click();
    await expect(frame.getByRole('listbox')).toBeVisible();
  });

  test('Escape closes listbox', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-combobox--default');
    await frame.locator('button[aria-haspopup="listbox"]').click();
    await expect(frame.getByRole('listbox')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(frame.getByRole('listbox')).not.toBeVisible();
  });

  test('selecting an option closes listbox', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-combobox--default');
    await frame.locator('button[aria-haspopup="listbox"]').click();
    await expect(frame.getByRole('listbox')).toBeVisible();
    await frame.getByRole('option', { name: /angular/i }).click();
    await expect(frame.getByRole('listbox')).not.toBeVisible();
  });

  test('selected option has aria-selected', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-combobox--default');
    await frame.locator('button[aria-haspopup="listbox"]').click();
    await expect(frame.getByRole('listbox')).toBeVisible();
    await frame.getByRole('option', { name: /vue/i }).click();
    // Reopen to verify aria-selected
    await frame.locator('button[aria-haspopup="listbox"]').click();
    await expect(frame.getByRole('option', { name: /vue/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});
