import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiSwipeActionHarness } from '../src/lib/mobile/src/testing/swipe-action-harness';

type PlaywrightPage = import('@playwright/test').Page;

// Real pointer input via page.mouse: the component listens to pointer events (mouse, pen and
// touch share one path), so a mouse drag exercises the same code as a finger swipe.
async function swipe(
  page: PlaywrightPage,
  frame: import('@playwright/test').FrameLocator,
  distancePx: number,
): Promise<void> {
  const box = await frame.locator('mui-swipe-action').boundingBox();
  if (!box) throw new Error('mui-swipe-action not found');
  const y = box.y + box.height / 2;
  // Swipe left (negative distance) starts near the right edge, swipe right near the left edge.
  const startX = distancePx < 0 ? box.x + box.width - 20 : box.x + 20;
  await page.mouse.move(startX, y);
  await page.mouse.down();
  await page.mouse.move(startX + distancePx, y, { steps: 5 });
  await page.mouse.up();
}

test.describe('SwipeAction — E2E pointer gesture', () => {
  test('swipe left past threshold sets data-revealed="right"', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'mobile-swipeaction--default');
    const swipeAction = await loader.getHarness(MuiSwipeActionHarness);
    const el = frame.locator('mui-swipe-action');
    await expect(el).toBeVisible();
    await swipe(page, frame, -90); // > REVEAL_THRESHOLD (72px)
    // Poll after the interaction: zoneless CD flushes to the DOM asynchronously.
    await expect.poll(() => swipeAction.getRevealedSide()).toBe('right');
  });

  test('swipe right resets row (removes data-revealed)', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'mobile-swipeaction--default');
    const swipeAction = await loader.getHarness(MuiSwipeActionHarness);
    await swipe(page, frame, -90);
    await expect.poll(() => swipeAction.getRevealedSide()).toBe('right');
    await swipe(page, frame, 90);
    await expect.poll(() => swipeAction.isRevealed()).toBe(false);
  });

  test('clicking revealed Delete action emits actionTriggered', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'mobile-swipeaction--default');
    const swipeAction = await loader.getHarness(MuiSwipeActionHarness);
    await swipe(page, frame, -90);
    await expect.poll(() => swipeAction.getRevealedSide()).toBe('right');
    await swipeAction.clickAction('Delete');
    await expect(frame.getByText('Triggered: delete')).toBeVisible();
  });
});
