import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('FAB — E2E click + state', () => {
  test('default FAB is not disabled and can be clicked', async ({ page }) => {
    const frame = await gotoStory(page, 'mobile-fab--default');
    const fab = frame.locator('mui-fab button');
    await expect(fab).toBeVisible();
    await expect(fab).not.toHaveAttribute('aria-disabled', 'true');
    await fab.click(); // must not throw
  });

  test('loading FAB is marked aria-disabled', async ({ page }) => {
    const frame = await gotoStory(page, 'mobile-fab--loading');
    const fab = frame.locator('mui-fab button');
    await expect(fab).toBeVisible();
    await expect(fab).toHaveAttribute('aria-disabled', 'true');
  });

  test('disabled FAB is marked aria-disabled', async ({ page }) => {
    const frame = await gotoStory(page, 'mobile-fab--disabled');
    const fab = frame.locator('mui-fab button');
    await expect(fab).toHaveAttribute('aria-disabled', 'true');
  });
});
