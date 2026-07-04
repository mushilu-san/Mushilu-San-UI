import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiDividerHarness } from '../src/lib/primitives/src/testing/divider-harness';

test.describe('Divider — E2E structure', () => {
  test('default divider is role=separator with horizontal orientation', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'primitives-divider--default');
    const divider = await loader.getHarness(MuiDividerHarness);
    expect(await divider.getRole()).toBe('separator');
    expect(await divider.getOrientation()).toBe('horizontal');
  });

  test('labelled divider exposes the label via aria-label', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'primitives-divider--with-label');
    const dividers = await loader.getAllHarnesses(MuiDividerHarness);
    expect(await dividers[0].getLabel()).toBe('or');
  });

  test('vertical divider reports aria-orientation=vertical', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'primitives-divider--vertical');
    const dividers = await loader.getAllHarnesses(MuiDividerHarness);
    expect(await dividers[0].getOrientation()).toBe('vertical');
  });
});
