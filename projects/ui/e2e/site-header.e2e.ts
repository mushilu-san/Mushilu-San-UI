import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('SiteHeader — E-11 collapsed menu (mobile)', () => {
  test.use({ viewport: { width: 375, height: 700 } });

  test('menu button opens the nav, Escape closes it and returns focus', async ({ page }) => {
    const frame = await gotoStory(page, 'navigation-siteheader--default');
    const button = frame.getByRole('button', { name: 'Menu' });
    const blog = frame.getByRole('link', { name: 'Blog' });

    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(blog).toBeHidden();

    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(blog).toBeVisible();

    await blog.focus();
    await page.keyboard.press('Escape');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(button).toBeFocused();
    await expect(blog).toBeHidden();
  });
});

test.describe('SiteHeader — E-11 wide screen', () => {
  test.use({ viewport: { width: 1200, height: 700 } });

  test('nav is inline and the menu button is gone', async ({ page }) => {
    const frame = await gotoStory(page, 'navigation-siteheader--default');
    await expect(frame.getByRole('link', { name: 'Blog' })).toBeVisible();
    await expect(frame.getByRole('button', { name: 'Menu' })).toBeHidden();
  });
});
