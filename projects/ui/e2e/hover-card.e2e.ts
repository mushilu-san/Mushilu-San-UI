import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiHoverCardHarness } from '../src/lib/overlays/src/testing/hover-card-harness';

test.describe('HoverCard — E-4 hover / focus / dismiss', () => {
  test('hovering trigger shows tooltip content', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'overlays-hovercard--default');
    const card = await loader.getHarness(MuiHoverCardHarness);
    const trigger = frame.getByRole('link', { name: /@mushilu-san/i });
    await trigger.hover();
    await expect(frame.getByRole('tooltip')).toBeVisible({ timeout: 5000 });
    await expect.poll(() => card.isOpen(), { timeout: 5000 }).toBe(true);
  });

  test('moving mouse away hides tooltip content', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'overlays-hovercard--default');
    const card = await loader.getHarness(MuiHoverCardHarness);
    const trigger = frame.getByRole('link', { name: /@mushilu-san/i });
    await trigger.hover();
    await expect(frame.getByRole('tooltip')).toBeVisible({ timeout: 5000 });
    // Move mouse away from the trigger
    await page.mouse.move(0, 0);
    await expect(frame.getByRole('tooltip')).not.toBeVisible({ timeout: 5000 });
    await expect.poll(() => card.isOpen(), { timeout: 5000 }).toBe(false);
  });

  test('focusing trigger shows tooltip content', async ({ page }) => {
    const { frame } = await gotoStoryWithHarness(page, 'overlays-hovercard--default');
    const trigger = frame.getByRole('link', { name: /@mushilu-san/i });
    await trigger.focus();
    await expect(frame.getByRole('tooltip')).toBeVisible({ timeout: 5000 });
  });
});
