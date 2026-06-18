import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('Command — E2E keyboard navigation', () => {
  test('search input filters items', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-command--default');
    const input = frame.getByRole('searchbox');
    await input.fill('new');
    const items = frame.locator('[data-command-item]');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });

  test('ArrowDown navigates to first item', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-command--default');
    const input = frame.getByRole('searchbox');
    await input.focus();
    await page.keyboard.press('ArrowDown');
    await expect(frame.locator('[data-command-item]').first()).toBeFocused();
  });

  test('ArrowUp from first item wraps to last', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-command--default');
    const input = frame.getByRole('searchbox');
    await input.focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
    await expect(frame.locator('[data-command-item]').last()).toBeFocused();
  });
});
