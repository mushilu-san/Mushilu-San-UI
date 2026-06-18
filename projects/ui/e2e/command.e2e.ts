import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('Command — E-6 search / keyboard / selection', () => {
  test('input field is visible and focusable', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-command--default');
    const input = frame.locator('input[type="text"]');
    await expect(input).toBeVisible();
    await input.click();
    await expect(input).toBeFocused();
  });

  test('typing filters visible items', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-command--default');
    const input = frame.locator('input[type="text"]');
    await input.fill('new');
    // "New file" and "New folder" should remain visible
    await expect(frame.getByRole('option', { name: /new file/i })).toBeVisible();
    await expect(frame.getByRole('option', { name: /new folder/i })).toBeVisible();
    // "Settings" should be hidden
    await expect(frame.getByRole('option', { name: /settings$/i })).not.toBeVisible();
  });

  test('ArrowDown navigates through items', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-command--default');
    const input = frame.locator('input[type="text"]');
    await input.click();
    await page.keyboard.press('ArrowDown');
    const firstItem = frame.locator('[data-command-item]').first();
    await expect(firstItem).toBeFocused();
  });

  test('ArrowUp navigates backward', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-command--default');
    const input = frame.locator('input[type="text"]');
    await input.click();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
    const firstItem = frame.locator('[data-command-item]').first();
    await expect(firstItem).toBeFocused();
  });
});
