import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiDropdownMenuHarness } from '../src/lib/overlays/src/testing/dropdown-menu-harness';

test.describe('DropdownMenu — E-2 keyboard navigation', () => {
  test('trigger click opens menu', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'overlays-dropdownmenu--default');
    const menu = await loader.getHarness(MuiDropdownMenuHarness);
    await frame.getByRole('button', { name: /options/i }).click();
    await expect(frame.getByRole('menu')).toBeVisible();
    await expect.poll(() => menu.isOpen()).toBe(true);
  });

  test('Escape closes menu', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'overlays-dropdownmenu--default');
    const menu = await loader.getHarness(MuiDropdownMenuHarness);
    await frame.getByRole('button', { name: /options/i }).click();
    await expect(frame.getByRole('menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(frame.getByRole('menu')).not.toBeVisible();
    await expect.poll(() => menu.isOpen()).toBe(false);
  });

  test('ArrowDown moves focus to first item', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'overlays-dropdownmenu--default');
    const menu = await loader.getHarness(MuiDropdownMenuHarness);
    await frame.getByRole('button', { name: /options/i }).click();
    // Wait for menu panel to render before pressing arrow keys
    await expect(frame.getByRole('menu')).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await expect.poll(() => menu.getFocusedItemIndex()).toBe(0);
  });

  test('ArrowDown navigates through items', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'overlays-dropdownmenu--default');
    const menu = await loader.getHarness(MuiDropdownMenuHarness);
    await frame.getByRole('button', { name: /options/i }).click();
    await expect(frame.getByRole('menu')).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await expect.poll(() => menu.getFocusedItemIndex()).toBe(1);
  });

  test('ArrowUp from first item wraps to last', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'overlays-dropdownmenu--default');
    const menu = await loader.getHarness(MuiDropdownMenuHarness);
    await frame.getByRole('button', { name: /options/i }).click();
    await expect(frame.getByRole('menu')).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
    const labels = await menu.getItemLabels();
    await expect.poll(() => menu.getFocusedItemIndex()).toBe(labels.length - 1);
  });

  test('Enter on a menu item closes menu', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'overlays-dropdownmenu--default');
    const menu = await loader.getHarness(MuiDropdownMenuHarness);
    await frame.getByRole('button', { name: /options/i }).click();
    await expect(frame.getByRole('menu')).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(frame.getByRole('menu')).not.toBeVisible();
    await expect.poll(() => menu.isOpen()).toBe(false);
  });
});
