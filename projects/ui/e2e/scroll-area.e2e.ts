import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiScrollAreaHarness } from '../src/lib/layout/src/testing/scroll-area-harness';

test.describe('ScrollArea — E2E scroll', () => {
  test('default vertical scroll area starts at scrollTop 0 with overflowing content', async ({
    page,
  }) => {
    const { loader } = await gotoStoryWithHarness(page, 'layout-scrollarea--default');
    const scrollArea = await loader.getHarness(MuiScrollAreaHarness);
    expect(await scrollArea.getOrientation()).toBe('vertical');
    expect(await scrollArea.getScrollTop()).toBe(0);
    expect(await scrollArea.getScrollHeight()).toBeGreaterThan(await scrollArea.getClientHeight());
  });

  test('mouse wheel scrolls the viewport vertically', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'layout-scrollarea--default');
    const scrollArea = await loader.getHarness(MuiScrollAreaHarness);
    const box = await frame.locator('mui-scroll-area').boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, 300);
    await expect.poll(() => scrollArea.getScrollTop()).toBeGreaterThan(0);
  });

  test('horizontal story scrolls the viewport horizontally', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'layout-scrollarea--horizontal');
    const scrollArea = await loader.getHarness(MuiScrollAreaHarness);
    expect(await scrollArea.getOrientation()).toBe('horizontal');
    const box = await frame.locator('mui-scroll-area').boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(300, 0);
    await expect.poll(() => scrollArea.getScrollLeft()).toBeGreaterThan(0);
  });

  test('scroll area content is reachable via Tab when tabindex="0"', async ({ page }) => {
    const { frame } = await gotoStoryWithHarness(page, 'layout-scrollarea--accessibility');
    const scrollArea = frame.locator('mui-scroll-area');
    await expect(scrollArea).toHaveAttribute('tabindex', '0');
  });
});
