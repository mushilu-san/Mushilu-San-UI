import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('Popover — E2E focus/Escape/return-focus', () => {
  test('click trigger opens popover', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-popover--default');
    await frame.getByRole('button').first().click();
    await expect(frame.locator('[data-open]')).toBeVisible();
  });

  test('Escape closes popover', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-popover--default');
    await frame.getByRole('button').first().click();
    await expect(frame.locator('[data-open]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(frame.locator('[data-open]')).not.toBeVisible();
  });

  test('focus returns to trigger after close', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-popover--default');
    const trigger = frame.getByRole('button').first();
    await trigger.click();
    await expect(frame.locator('[data-open]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  });
});
