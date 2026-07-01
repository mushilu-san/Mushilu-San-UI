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
});
