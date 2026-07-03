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

  test('H-E-fd6a0a: focus returns to what was focused before the menu opened, after Escape', async ({
    page,
  }) => {
    const { frame } = await gotoStoryWithHarness(page, 'overlays-contextmenu--default');
    // ContextMenu's trigger area is a plain (non-focusable) div — the realistic
    // keyboard-user scenario is: focus lands elsewhere on the page, the menu is
    // opened (right-click), focus moves into it, and Escape must restore focus
    // to that prior element rather than stranding it on <body>.
    const priorFocus = frame.getByRole('button', { name: 'Focus me first' });
    await priorFocus.focus();
    await expect(priorFocus).toBeFocused();
    await frame.getByText('Right-click here').click({ button: 'right', force: true });
    await expect(frame.getByRole('menu')).toBeVisible();
    await frame.getByRole('menuitem').first().focus();
    await page.keyboard.press('Escape');
    await expect(frame.getByRole('menu')).not.toBeVisible();
    await expect(priorFocus).toBeFocused();
  });
});
