import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiCardHarness } from '../src/lib/data-display/src/testing/card-harness';

test.describe('Card — E-13 structural & clickable', () => {
  test('Default story renders flat, non-clickable card with projected content', async ({
    page,
  }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'data-display-card--default');
    const card = await loader.getHarness(MuiCardHarness);
    expect(await card.getVariant()).toBe('flat');
    expect(await card.isClickable()).toBe(false);
    expect(await card.getRole()).toBeNull();
    await expect(frame.locator('mui-card')).toContainText('Card Title');
  });

  test('Variants story renders flat, elevated, and outlined cards', async ({ page }) => {
    const { frame } = await gotoStoryWithHarness(page, 'data-display-card--variants');
    const cards = frame.locator('mui-card');
    await expect(cards).toHaveCount(3);
    await expect(cards.nth(0)).toHaveAttribute('data-variant', 'flat');
    await expect(cards.nth(1)).toHaveAttribute('data-variant', 'elevated');
    await expect(cards.nth(2)).toHaveAttribute('data-variant', 'outlined');
  });

  test('clickable card exposes role=button, tabindex=0, and a 44px touch target', async ({
    page,
  }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'data-display-card--clickable');
    const card = await loader.getHarness(MuiCardHarness);
    expect(await card.isClickable()).toBe(true);
    expect(await card.getRole()).toBe('button');

    const host = frame.locator('mui-card');
    await expect(host).toHaveAttribute('tabindex', '0');
    const box = await host.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
    expect(box?.width).toBeGreaterThanOrEqual(44);
  });
});
