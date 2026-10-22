import { test, expect } from '@playwright/test';
import { gotoStoryRtl } from './helpers/rtl';

type PlaywrightPage = import('@playwright/test').Page;

test.describe('Overlays / mobile — RTL placement', () => {
  test('Sheet side="start" opens against the right edge in RTL; Escape returns focus', async ({
    page,
  }) => {
    const frame = await gotoStoryRtl(page, 'feedback-sheet--logical-sides');
    const trigger = frame.getByRole('button', { name: 'Open start sheet' });
    await trigger.click();
    const dialog = frame.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(frame.locator('dialog:focus-within')).toBeAttached();
    const box = await dialog.boundingBox();
    const vw = await frame.locator('html').evaluate((el) => el.clientWidth);
    if (!box) throw new Error('sheet not found');
    expect(box.x + box.width).toBeGreaterThan(vw - 4);
    expect(box.x).toBeGreaterThan(0);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test('Popover placement="start" opens to the right of the trigger in RTL', async ({ page }) => {
    const frame = await gotoStoryRtl(page, 'overlays-popover--logical-placements');
    const trigger = frame.getByRole('button', { name: 'Start popover' });
    await trigger.click();
    const dialog = frame.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const t = await trigger.boundingBox();
    const d = await dialog.boundingBox();
    if (!t || !d) throw new Error('boxes missing');
    expect(d.x).toBeGreaterThanOrEqual(t.x + t.width - 2);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test('HoverCard placement="start" opens to the right of the trigger in RTL', async ({ page }) => {
    const frame = await gotoStoryRtl(page, 'overlays-hovercard--logical-placements');
    const trigger = frame.getByRole('button', { name: 'Start card' });
    await trigger.hover();
    const card = frame.getByRole('tooltip');
    await expect(card).toBeVisible({ timeout: 5000 });
    const t = await trigger.boundingBox();
    const c = await card.boundingBox();
    if (!t || !c) throw new Error('boxes missing');
    expect(c.x).toBeGreaterThanOrEqual(t.x + t.width - 2);
  });

  test('Tooltip placement="start" sits right of the trigger and carries dir=rtl', async ({
    page,
  }) => {
    const frame = await gotoStoryRtl(page, 'data-display-tooltip--logical-placements');
    const trigger = frame.getByRole('button', { name: 'Start' });
    await trigger.hover();
    const tip = frame.getByRole('tooltip');
    await expect(tip).toBeVisible();
    await expect(tip).toHaveAttribute('dir', 'rtl');
    const t = await trigger.boundingBox();
    const b = await tip.boundingBox();
    if (!t || !b) throw new Error('boxes missing');
    expect(b.x).toBeGreaterThanOrEqual(t.x + t.width - 2);
  });

  test('SwipeAction: end action lives on the left in RTL; swiping right reveals it', async ({
    page,
  }) => {
    const frame = await gotoStoryRtl(page, 'mobile-swipeaction--logical-end');
    const el = frame.locator('mui-swipe-action');
    await expect(el).toBeVisible();
    await touchSwipe(page, el, 90);
    await expect.poll(() => el.getAttribute('data-revealed')).toBe('left');
  });
});

// Real pointer input via page.mouse: SwipeAction listens to pointer events (mouse, pen and touch
// share one path), same approach as swipe-action.e2e.ts.
async function touchSwipe(
  page: PlaywrightPage,
  el: import('@playwright/test').Locator,
  dx: number,
): Promise<void> {
  const box = await el.boundingBox();
  if (!box) throw new Error('mui-swipe-action not found');
  const startX = box.x + 20;
  const y = box.y + box.height / 2;
  await page.mouse.move(startX, y);
  await page.mouse.down();
  await page.mouse.move(startX + dx, y, { steps: 5 });
  await page.mouse.up();
}
