import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiBadgeHarness } from '../src/lib/primitives/src/testing/badge-harness';

test.describe('Badge — E2E structure', () => {
  test('default badge renders its text content and is not a dot', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'primitives-badge--default');
    const badge = await loader.getHarness(MuiBadgeHarness);
    expect(await badge.getText()).toBe('Badge');
    expect(await badge.getVariant()).toBe('default');
    expect(await badge.isDot()).toBe(false);
  });

  test('dot badge with a label exposes it via aria-label', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'primitives-badge--dot-indicators');
    const badges = await loader.getAllHarnesses(MuiBadgeHarness);
    expect(await badges[0].isDot()).toBe(true);
    expect(await badges[0].getLabel()).toBe('Offline');
  });

  test('dot badge with no label is aria-hidden (decorative)', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'primitives-badge--accessibility');
    const badges = await loader.getAllHarnesses(MuiBadgeHarness);
    const decorativeDot = badges[2];
    expect(await decorativeDot.isDot()).toBe(true);
    expect(await decorativeDot.getLabel()).toBe(null);
    expect(await decorativeDot.isAriaHidden()).toBe(true);
  });
});
