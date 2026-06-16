import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('Sheet — E2E focus management', () => {
  test('focus moves inside sheet on open', async ({ page }) => {
    const frame = await gotoStory(page, 'feedback-sheet--default');
    await frame.getByRole('button', { name: 'Open sheet' }).click();
    await expect(frame.getByRole('dialog')).toBeVisible();
    await expect(frame.locator('dialog:focus-within')).toBeAttached();
  });

  test('Escape closes the sheet', async ({ page }) => {
    const frame = await gotoStory(page, 'feedback-sheet--default');
    await frame.getByRole('button', { name: 'Open sheet' }).click();
    await expect(frame.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(frame.getByRole('dialog')).not.toBeVisible();
  });

  test('focus returns to trigger after Escape', async ({ page }) => {
    const frame = await gotoStory(page, 'feedback-sheet--default');
    const trigger = frame.getByRole('button', { name: 'Open sheet' });
    await trigger.click();
    await expect(frame.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(frame.getByRole('dialog')).not.toBeVisible();
    await expect(trigger).toBeFocused({ timeout: 2000 });
  });
});
