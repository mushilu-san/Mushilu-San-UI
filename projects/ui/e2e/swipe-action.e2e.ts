import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiSwipeActionHarness } from '../src/lib/mobile/src/testing/swipe-action-harness';

type PlaywrightPage = import('@playwright/test').Page;

async function getStoryFrame(page: PlaywrightPage) {
  const frame = page.frames().find((f) => f.url().includes('/iframe.html'));
  if (!frame) throw new Error('Storybook preview iframe not found');
  return frame;
}

// Raw touch-event simulation kept as-is — a harness wouldn't meaningfully simplify
// dispatching synthetic TouchEvents, per the pattern established in slider.e2e.ts for
// pointer-drag tests.
async function swipeLeft(page: PlaywrightPage, distancePx: number): Promise<void> {
  const storyFrame = await getStoryFrame(page);
  await storyFrame.evaluate((dist: number) => {
    const el = document.querySelector('mui-swipe-action');
    if (!el) throw new Error('mui-swipe-action not found');
    const rect = el.getBoundingClientRect();
    const startX = rect.right - 20;
    const endX = startX - dist;
    const y = rect.top + rect.height / 2;
    const touch = (x: number) =>
      new Touch({ identifier: 1, target: el, clientX: x, clientY: y, pageX: x, pageY: y });
    el.dispatchEvent(
      new TouchEvent('touchstart', {
        touches: [touch(startX)],
        changedTouches: [touch(startX)],
        bubbles: true,
        cancelable: true,
      }),
    );
    for (let i = 1; i <= 5; i++) {
      const x = startX - (dist * i) / 5;
      el.dispatchEvent(
        new TouchEvent('touchmove', {
          touches: [touch(x)],
          changedTouches: [touch(x)],
          bubbles: true,
          cancelable: true,
        }),
      );
    }
    el.dispatchEvent(
      new TouchEvent('touchend', {
        touches: [],
        changedTouches: [touch(endX)],
        bubbles: true,
        cancelable: true,
      }),
    );
  }, distancePx);
}

async function swipeRight(page: PlaywrightPage, distancePx: number): Promise<void> {
  const storyFrame = await getStoryFrame(page);
  await storyFrame.evaluate((dist: number) => {
    const el = document.querySelector('mui-swipe-action');
    if (!el) throw new Error('mui-swipe-action not found');
    const rect = el.getBoundingClientRect();
    const startX = rect.left + 20;
    const endX = startX + dist;
    const y = rect.top + rect.height / 2;
    const touch = (x: number) =>
      new Touch({ identifier: 1, target: el, clientX: x, clientY: y, pageX: x, pageY: y });
    el.dispatchEvent(
      new TouchEvent('touchstart', {
        touches: [touch(startX)],
        changedTouches: [touch(startX)],
        bubbles: true,
        cancelable: true,
      }),
    );
    for (let i = 1; i <= 5; i++) {
      const x = startX + (dist * i) / 5;
      el.dispatchEvent(
        new TouchEvent('touchmove', {
          touches: [touch(x)],
          changedTouches: [touch(x)],
          bubbles: true,
          cancelable: true,
        }),
      );
    }
    el.dispatchEvent(
      new TouchEvent('touchend', {
        touches: [],
        changedTouches: [touch(endX)],
        bubbles: true,
        cancelable: true,
      }),
    );
  }, distancePx);
}

test.describe('SwipeAction — E2E touch gesture', () => {
  test('swipe left past threshold sets data-revealed="right"', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'mobile-swipeaction--default');
    const swipeAction = await loader.getHarness(MuiSwipeActionHarness);
    const el = frame.locator('mui-swipe-action');
    await expect(el).toBeVisible();
    await swipeLeft(page, 90); // > REVEAL_THRESHOLD (72px)
    // Poll after the interaction: zoneless CD flushes to the DOM asynchronously.
    await expect.poll(() => swipeAction.getRevealedSide()).toBe('right');
  });

  test('swipe right resets row (removes data-revealed)', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'mobile-swipeaction--default');
    const swipeAction = await loader.getHarness(MuiSwipeActionHarness);
    await swipeLeft(page, 90);
    await expect.poll(() => swipeAction.getRevealedSide()).toBe('right');
    await swipeRight(page, 90);
    await expect.poll(() => swipeAction.isRevealed()).toBe(false);
  });

  test('clicking revealed Delete action emits actionTriggered', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'mobile-swipeaction--default');
    const swipeAction = await loader.getHarness(MuiSwipeActionHarness);
    await swipeLeft(page, 90);
    await expect.poll(() => swipeAction.getRevealedSide()).toBe('right');
    await swipeAction.clickAction('Delete');
    await expect(frame.getByText('Triggered: delete')).toBeVisible();
  });
});
