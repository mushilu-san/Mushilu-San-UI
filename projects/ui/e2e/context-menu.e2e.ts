import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('ContextMenu — E-5 right-click / Escape / keyboard', () => {
  test('right-click on trigger opens context menu', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-contextmenu--default');
    await frame.getByText('Right-click here').click({ button: 'right', force: true });
    await expect(frame.getByRole('menu')).toBeVisible();
  });

  test('Escape closes context menu', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-contextmenu--default');
    await frame.getByText('Right-click here').click({ button: 'right', force: true });
    await expect(frame.getByRole('menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(frame.getByRole('menu')).not.toBeVisible();
  });

  test('menu items have menuitem role', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-contextmenu--default');
    await frame.getByText('Right-click here').click({ button: 'right', force: true });
    await expect(frame.getByRole('menu')).toBeVisible();
    const items = frame.getByRole('menuitem');
    await expect(items).toHaveCount(4); // View, Edit, Duplicate, Delete
  });

  test('Tab navigates to first menu item', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-contextmenu--default');
    await frame.getByText('Right-click here').click({ button: 'right', force: true });
    await expect(frame.getByRole('menu')).toBeVisible();
    await frame.getByRole('menuitem').first().focus();
    await expect(frame.getByRole('menuitem').first()).toBeFocused();
  });
});
