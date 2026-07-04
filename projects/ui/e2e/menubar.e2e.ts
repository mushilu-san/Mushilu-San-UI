import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiMenubarHarness } from '../src/lib/navigation/src/testing/menubar-harness';

test.describe('Menubar — E-11 open/close, roving focus, Escape', () => {
  test('clicking a trigger opens its menu', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'navigation-menubar--default');
    const menubar = await loader.getHarness(MuiMenubarHarness);
    await frame.getByRole('menuitem', { name: 'File', exact: true }).click();
    await expect(frame.getByRole('menu').first()).toBeVisible();
    await expect.poll(() => menubar.isOpen()).toBe(true);
    await expect.poll(() => menubar.isMenuOpen('File')).toBe(true);
  });

  test('clicking the open trigger again closes its menu', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'navigation-menubar--default');
    const menubar = await loader.getHarness(MuiMenubarHarness);
    const fileTrigger = frame.getByRole('menuitem', { name: 'File', exact: true });
    await fileTrigger.click();
    await expect.poll(() => menubar.isOpen()).toBe(true);
    await fileTrigger.click();
    await expect.poll(() => menubar.isOpen()).toBe(false);
  });

  test('ArrowRight moves focus to the next trigger', async ({ page }) => {
    const { frame } = await gotoStoryWithHarness(page, 'navigation-menubar--default');
    await frame.getByRole('menuitem', { name: 'File', exact: true }).click();
    await page.keyboard.press('Escape'); // close, keep focus on File trigger
    await page.keyboard.press('ArrowRight');
    await expect(frame.getByRole('menuitem', { name: 'Edit' })).toBeFocused();
  });

  test('clicking a menu item then ArrowDown moves focus to the next item', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'navigation-menubar--default');
    const menubar = await loader.getHarness(MuiMenubarHarness);
    await frame.getByRole('menuitem', { name: 'File', exact: true }).click();
    await frame.getByRole('menuitem', { name: 'New File' }).click({ position: { x: 2, y: 2 } });
    // Clicking an item closes the menu per MenubarItem.onClick(), so re-open and focus directly.
    await frame.getByRole('menuitem', { name: 'File', exact: true }).click();
    await frame.getByText('New File').focus();
    await expect.poll(() => menubar.getFocusedItemIndex()).toBe(0);
    await page.keyboard.press('ArrowDown');
    await expect.poll(() => menubar.getFocusedItemIndex()).toBe(1);
  });

  test('B-11: Escape while a menu item has focus closes the menu and returns focus to the trigger', async ({
    page,
  }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'navigation-menubar--default');
    const menubar = await loader.getHarness(MuiMenubarHarness);
    const fileTrigger = frame.getByRole('menuitem', { name: 'File', exact: true });
    await fileTrigger.click();
    await frame.getByText('New File').focus();
    await expect.poll(() => menubar.getFocusedItemIndex()).toBe(0);
    await page.keyboard.press('Escape');
    await expect.poll(() => menubar.isOpen()).toBe(false);
    await expect(fileTrigger).toBeFocused();
  });

  test('clicking outside the menubar closes the open menu', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'navigation-menubar--default');
    const menubar = await loader.getHarness(MuiMenubarHarness);
    await frame.getByRole('menuitem', { name: 'File', exact: true }).click();
    await expect.poll(() => menubar.isOpen()).toBe(true);
    await frame.locator('body').click({ position: { x: 400, y: 300 }, force: true });
    await expect.poll(() => menubar.isOpen()).toBe(false);
  });
});
