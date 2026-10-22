import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiPopoverHarness } from '../src/lib/overlays/src/testing/popover-harness';

test.describe('Popover — E-3 focus / Escape / return-focus', () => {
  test('clicking trigger opens popover dialog', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'overlays-popover--default');
    const popover = await loader.getHarness(MuiPopoverHarness);
    await frame.getByRole('button', { name: /open popover/i }).click();
    await expect(frame.getByRole('dialog')).toBeVisible();
    await expect.poll(() => popover.isOpen()).toBe(true);
  });

  test('H-E-3a3965: focus moves inside popover on open', async ({ page }) => {
    const { frame } = await gotoStoryWithHarness(page, 'overlays-popover--default');
    await frame.getByRole('button', { name: /open popover/i }).click();
    await expect(frame.getByRole('dialog')).toBeVisible();
    await expect(frame.locator('[role=dialog]:focus-within')).toBeAttached();
  });

  test('Escape closes popover', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'overlays-popover--default');
    const popover = await loader.getHarness(MuiPopoverHarness);
    await frame.getByRole('button', { name: /open popover/i }).click();
    await expect(frame.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(frame.getByRole('dialog')).not.toBeVisible();
    await expect.poll(() => popover.isOpen()).toBe(false);
  });

  test('focus returns to trigger after Escape', async ({ page }) => {
    // Focus-order/return-focus assertions are handled natively via Playwright's
    // `.toBeFocused()` — no harness needed here, per project e2e conventions.
    const { frame } = await gotoStoryWithHarness(page, 'overlays-popover--default');
    const trigger = frame.getByRole('button', { name: /open popover/i });
    await trigger.click();
    await expect(frame.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(frame.getByRole('dialog')).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test('H-C-c098c2: panel is placed under the trigger and inside the viewport', async ({
    page,
  }) => {
    const { frame } = await gotoStoryWithHarness(page, 'overlays-popover--default');
    const trigger = frame.getByRole('button', { name: /open popover/i });
    await trigger.click();
    const panel = frame.getByRole('dialog');
    await expect(panel).toBeVisible();
    const t = await trigger.boundingBox();
    const p = await panel.boundingBox();
    const vp = page.viewportSize();
    if (!t || !p || !vp) throw new Error('missing geometry');
    expect(p.y).toBeGreaterThanOrEqual(t.y + t.height);
    expect(p.y - (t.y + t.height)).toBeLessThanOrEqual(8 + 4);
    expect(p.x).toBeGreaterThanOrEqual(4 - 1);
    expect(p.x + p.width).toBeLessThanOrEqual(vp.width - 4 + 1);
  });
});
