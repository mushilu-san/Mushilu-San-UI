import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('BottomSheet — E2E focus management', () => {
  test('focus moves inside bottom sheet on open', async ({ page }) => {
    const frame = await gotoStory(page, 'mobile-bottomsheet--default');
    await frame.getByRole('button', { name: 'Open Sheet' }).click();
    await expect(frame.getByRole('dialog')).toBeVisible();
    await expect(frame.locator('dialog:focus-within')).toBeAttached();
  });

  test('Escape closes the bottom sheet', async ({ page }) => {
    const frame = await gotoStory(page, 'mobile-bottomsheet--default');
    await frame.getByRole('button', { name: 'Open Sheet' }).click();
    await expect(frame.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(frame.getByRole('dialog')).not.toBeVisible();
  });

  test('focus returns to trigger after Escape', async ({ page }) => {
    const frame = await gotoStory(page, 'mobile-bottomsheet--default');
    const trigger = frame.getByRole('button', { name: 'Open Sheet' });
    await trigger.click();
    await expect(frame.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(frame.getByRole('dialog')).not.toBeVisible();
    await expect(trigger).toBeFocused({ timeout: 2000 });
  });
});
