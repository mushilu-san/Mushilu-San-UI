import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiFabHarness } from '../src/lib/mobile/src/testing/fab-harness';

test.describe('FAB — E2E click + state', () => {
  test('default FAB is not disabled and can be clicked', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'mobile-fab--default');
    const fab = await loader.getHarness(MuiFabHarness);
    expect(await fab.isDisabled()).toBe(false);
    await fab.click(); // must not throw
  });

  test('loading FAB is marked aria-disabled and aria-busy', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'mobile-fab--loading');
    const fab = await loader.getHarness(MuiFabHarness);
    expect(await fab.isDisabled()).toBe(true);
    expect(await fab.isLoading()).toBe(true);
  });

  test('disabled FAB is marked aria-disabled', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'mobile-fab--disabled');
    const fab = await loader.getHarness(MuiFabHarness);
    expect(await fab.isDisabled()).toBe(true);
  });
});
