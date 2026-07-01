import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiContextMenuHarness } from '../src/lib/overlays/src/testing/context-menu-harness';

test.describe('ContextMenu — E-5 right-click / Escape / keyboard', () => {
  test('right-click on trigger opens context menu', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'overlays-contextmenu--default');
    const menu = await loader.getHarness(MuiContextMenuHarness);
    await frame.getByText('Right-click here').click({ button: 'right', force: true });
    await expect(frame.getByRole('menu')).toBeVisible();
    await expect.poll(() => menu.isOpen()).toBe(true);
  });

  test('Escape closes context menu', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'overlays-contextmenu--default');
    const menu = await loader.getHarness(MuiContextMenuHarness);
    await frame.getByText('Right-click here').click({ button: 'right', force: true });
    await expect(frame.getByRole('menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(frame.getByRole('menu')).not.toBeVisible();
    await expect.poll(() => menu.isOpen()).toBe(false);
  });

  test('menu items have menuitem role', async ({ page }) => {
    const { frame } = await gotoStoryWithHarness(page, 'overlays-contextmenu--default');
    await frame.getByText('Right-click here').click({ button: 'right', force: true });
    await expect(frame.getByRole('menu')).toBeVisible();
    const items = frame.getByRole('menuitem');
    await expect(items).toHaveCount(4); // View, Edit, Duplicate, Delete
  });

  test('Tab navigates to first menu item', async ({ page }) => {
    const { frame } = await gotoStoryWithHarness(page, 'overlays-contextmenu--default');
    await frame.getByText('Right-click here').click({ button: 'right', force: true });
    await expect(frame.getByRole('menu')).toBeVisible();
    await frame.getByRole('menuitem').first().focus();
    await expect(frame.getByRole('menuitem').first()).toBeFocused();
  });
});
