import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('ContextMenu — E2E focus/Escape/return-focus', () => {
  test('right-click opens context menu', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-contextmenu--default');
    const trigger = frame.locator('[muiContextMenuTrigger]').first();
    await trigger.click({ button: 'right' });
    await expect(frame.getByRole('menu')).toBeVisible();
  });

  test('Escape closes context menu', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-contextmenu--default');
    const trigger = frame.locator('[muiContextMenuTrigger]').first();
    await trigger.click({ button: 'right' });
    await expect(frame.getByRole('menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(frame.getByRole('menu')).not.toBeVisible();
  });

  test('clicking menu item closes menu', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-contextmenu--default');
    const trigger = frame.locator('[muiContextMenuTrigger]').first();
    await trigger.click({ button: 'right' });
    await expect(frame.getByRole('menu')).toBeVisible();
    await frame.getByRole('menuitem').first().click();
    await expect(frame.getByRole('menu')).not.toBeVisible();
  });
});
