import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiNavLinkHarness } from '../src/lib/navigation/src/testing/nav-link-harness';

test.describe('NavLink — E-11 active state & keyboard', () => {
  test('inactive link has no aria-current', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'navigation-navlink--default');
    const link = await loader.getHarness(MuiNavLinkHarness);
    expect(await link.isActive()).toBe(false);
    expect(await link.getAriaCurrent()).toBeNull();
  });

  test('active link exposes aria-current="page" and data-active', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'navigation-navlink--active');
    const link = await loader.getHarness(MuiNavLinkHarness);
    expect(await link.isActive()).toBe(true);
    expect(await link.getAriaCurrent()).toBe('page');
  });

  test('NavBar: exactly one link is marked as the current page', async ({ page }) => {
    const frame = await gotoStory(page, 'navigation-navlink--nav-bar');
    await expect(frame.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(frame.getByRole('link', { name: 'Products' })).not.toHaveAttribute('aria-current');
    await expect(frame.getByRole('link', { name: 'Orders' })).not.toHaveAttribute('aria-current');
  });

  test('Tab moves focus through the nav bar links in order', async ({ page }) => {
    const frame = await gotoStory(page, 'navigation-navlink--nav-bar');
    await frame.getByRole('link', { name: 'Dashboard' }).focus();
    await page.keyboard.press('Tab');
    await expect(frame.getByRole('link', { name: 'Products' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(frame.getByRole('link', { name: 'Orders' })).toBeFocused();
  });
});
