import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('MobileNav — E2E active state', () => {
  test('Home is initially active (aria-current="page")', async ({ page }) => {
    const frame = await gotoStory(page, 'mobile-mobilenav--default');
    await expect(frame.getByRole('button', { name: 'Home' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('clicking Search sets aria-current="page" on Search', async ({ page }) => {
    const frame = await gotoStory(page, 'mobile-mobilenav--default');
    await frame.getByRole('button', { name: 'Search' }).click();
    await expect(frame.getByRole('button', { name: 'Search' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('clicking Search removes aria-current from Home', async ({ page }) => {
    const frame = await gotoStory(page, 'mobile-mobilenav--default');
    await frame.getByRole('button', { name: 'Search' }).click();
    await expect(frame.getByRole('button', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });

  test('only one item is active at a time', async ({ page }) => {
    const frame = await gotoStory(page, 'mobile-mobilenav--default');
    await frame.getByRole('button', { name: 'Likes' }).click();
    const activeBtns = frame.locator('[aria-current="page"]');
    await expect(activeBtns).toHaveCount(1);
  });
});
