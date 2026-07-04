import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiSpacerHarness } from '../src/lib/layout/src/testing/spacer-harness';

test.describe('Spacer — E2E structural', () => {
  test('default (no size) spacer is flexible and grows to fill space', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'layout-spacer--default');
    const spacer = await loader.getHarness(MuiSpacerHarness);
    expect(await spacer.isFlexible()).toBe(true);
  });

  test('fixed-size spacers are not flexible and report a non-zero width', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'layout-spacer--fixed-size');
    const spacers = await loader.getAllHarnesses(MuiSpacerHarness);
    expect(spacers.length).toBeGreaterThanOrEqual(2);
    for (const spacer of spacers) {
      expect(await spacer.isFlexible()).toBe(false);
      expect(Number.parseFloat(await spacer.getWidth())).toBeGreaterThan(0);
    }
  });

  test('spacer is hidden from the accessibility tree', async ({ page }) => {
    const { frame } = await gotoStoryWithHarness(page, 'layout-spacer--default');
    await expect(frame.locator('mui-spacer')).toHaveAttribute('aria-hidden', 'true');
  });
});
