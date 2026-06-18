import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('Popover — E-3 focus / Escape / return-focus', () => {
  test('clicking trigger opens popover dialog', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-popover--default');
    await frame.getByRole('button', { name: /open popover/i }).click();
    await expect(frame.getByRole('dialog')).toBeVisible();
  });

  test('Escape closes popover', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-popover--default');
    await frame.getByRole('button', { name: /open popover/i }).click();
    await expect(frame.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(frame.getByRole('dialog')).not.toBeVisible();
  });

  test('focus returns to trigger after Escape', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-popover--default');
    const trigger = frame.getByRole('button', { name: /open popover/i });
    await trigger.click();
    await expect(frame.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(frame.getByRole('dialog')).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });
});
