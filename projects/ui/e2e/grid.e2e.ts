import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiGridHarness } from '../src/lib/layout/src/testing/grid-harness';

test.describe('Grid — E2E structural', () => {
  test('default story renders 3 columns', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'layout-grid--default');
    const grid = await loader.getHarness(MuiGridHarness);
    expect(await grid.getColumnCount()).toBe(3);
  });

  test('independent-gaps story applies distinct column/row gaps', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'layout-grid--independent-gaps');
    const grid = await loader.getHarness(MuiGridHarness);
    const columnGap = await grid.getColumnGap();
    const rowGap = await grid.getRowGap();
    expect(columnGap).not.toBe(rowGap);
    expect(Number.parseFloat(columnGap)).toBeGreaterThan(Number.parseFloat(rowGap));
  });

  test('all grid children are rendered as direct content', async ({ page }) => {
    const { frame } = await gotoStoryWithHarness(page, 'layout-grid--default');
    await expect(frame.locator('mui-grid > div')).toHaveCount(6);
  });
});
