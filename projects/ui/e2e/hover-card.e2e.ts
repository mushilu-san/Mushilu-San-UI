import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('HoverCard — E2E hover/focus/Escape', () => {
  test('hover shows card content', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-hovercard--default');
    const trigger = frame.locator('[muiHoverCardTrigger]').first();
    await trigger.hover();
    await expect(frame.locator('mui-hover-card-content')).toBeVisible();
  });

  test('mouse leave hides card', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-hovercard--default');
    const trigger = frame.locator('[muiHoverCardTrigger]').first();
    await trigger.hover();
    await expect(frame.locator('mui-hover-card-content')).toBeVisible();
    await page.mouse.move(0, 0);
    await expect(frame.locator('mui-hover-card-content')).not.toBeVisible();
  });

  test('Escape closes card', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-hovercard--default');
    const trigger = frame.locator('[muiHoverCardTrigger]').first();
    await trigger.hover();
    await expect(frame.locator('mui-hover-card-content')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(frame.locator('mui-hover-card-content')).not.toBeVisible();
  });
});
