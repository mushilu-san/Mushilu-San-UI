import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiMobileNavHarness } from '../src/lib/mobile/src/testing/mobile-nav-harness';

test.describe('MobileNav — E2E active state', () => {
  test('Home is initially active (aria-current="page")', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'mobile-mobilenav--default');
    const nav = await loader.getHarness(MuiMobileNavHarness);
    expect(await nav.getActiveLabel()).toBe('Home');
  });

  test('clicking Search sets aria-current="page" on Search', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'mobile-mobilenav--default');
    const nav = await loader.getHarness(MuiMobileNavHarness);
    await nav.clickItem('Search');
    // Poll after the interaction: zoneless CD flushes to the DOM asynchronously.
    await expect.poll(() => nav.getActiveLabel()).toBe('Search');
  });

  test('clicking Search removes aria-current from Home', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'mobile-mobilenav--default');
    const nav = await loader.getHarness(MuiMobileNavHarness);
    await nav.clickItem('Search');
    await expect.poll(() => nav.getActiveLabel()).toBe('Search');
    expect(await nav.getActiveLabel()).not.toBe('Home');
  });

  test('only one item is active at a time', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'mobile-mobilenav--default');
    const nav = await loader.getHarness(MuiMobileNavHarness);
    await nav.clickItem('Likes');
    await expect.poll(() => nav.getActiveCount()).toBe(1);
  });
});
