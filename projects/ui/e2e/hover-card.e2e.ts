import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('HoverCard — E-4 hover / focus / dismiss', () => {
  test('hovering trigger shows tooltip content', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-hovercard--default');
    const trigger = frame.getByRole('link', { name: /@mushilu-san/i });
    await trigger.hover();
    await expect(frame.getByRole('tooltip')).toBeVisible({ timeout: 5000 });
  });

  test('moving mouse away hides tooltip content', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-hovercard--default');
    const trigger = frame.getByRole('link', { name: /@mushilu-san/i });
    await trigger.hover();
    await expect(frame.getByRole('tooltip')).toBeVisible({ timeout: 5000 });
    // Move mouse away from the trigger
    await page.mouse.move(0, 0);
    await expect(frame.getByRole('tooltip')).not.toBeVisible({ timeout: 5000 });
  });

  test('focusing trigger shows tooltip content', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-hovercard--default');
    const trigger = frame.getByRole('link', { name: /@mushilu-san/i });
    await trigger.focus();
    await expect(frame.getByRole('tooltip')).toBeVisible({ timeout: 5000 });
  });
});
