import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiContainerHarness } from '../src/lib/layout/src/testing/container-harness';

test.describe('Container — E2E structural', () => {
  test('default story renders size="lg" and padded', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'layout-container--default');
    const container = await loader.getHarness(MuiContainerHarness);
    expect(await container.getSize()).toBe('lg');
    expect(await container.isPadded()).toBe(true);
  });

  test('unpadded story applies data-padded=null on the second container', async ({ page }) => {
    const { frame } = await gotoStoryWithHarness(page, 'layout-container--unpadded');
    const containers = frame.locator('mui-container');
    await expect(containers.nth(1)).not.toHaveAttribute('data-padded');
  });

  test('content passed via ng-content is rendered inside the container', async ({ page }) => {
    const { frame } = await gotoStoryWithHarness(page, 'layout-container--default');
    await expect(frame.locator('mui-container')).toContainText('content is centered');
  });
});
