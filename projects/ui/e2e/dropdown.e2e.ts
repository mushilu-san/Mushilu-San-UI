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

  test('H-E-c091ef: opening the menu moves focus onto the first item', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'overlays-dropdownmenu--default');
    const menu = await loader.getHarness(MuiDropdownMenuHarness);
    await frame.getByRole('button', { name: /options/i }).click();
    await expect(frame.getByRole('menu')).toBeVisible();
    await expect.poll(() => menu.getFocusedItemIndex()).toBe(0);
  });

  test('ArrowDown navigates through items', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'overlays-dropdownmenu--default');
    const menu = await loader.getHarness(MuiDropdownMenuHarness);
    await frame.getByRole('button', { name: /options/i }).click();
    await expect(frame.getByRole('menu')).toBeVisible();
    await expect.poll(() => menu.getFocusedItemIndex()).toBe(0);
    await page.keyboard.press('ArrowDown');
    await expect.poll(() => menu.getFocusedItemIndex()).toBe(1);
  });

  test('ArrowUp from first item wraps to last', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'overlays-dropdownmenu--default');
    const menu = await loader.getHarness(MuiDropdownMenuHarness);
    await frame.getByRole('button', { name: /options/i }).click();
    await expect(frame.getByRole('menu')).toBeVisible();
    await expect.poll(() => menu.getFocusedItemIndex()).toBe(0);
    await page.keyboard.press('ArrowUp');
    const labels = await menu.getItemLabels();
    await expect.poll(() => menu.getFocusedItemIndex()).toBe(labels.length - 1);
  });

  test('Enter on a menu item closes menu', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'overlays-dropdownmenu--default');
    const menu = await loader.getHarness(MuiDropdownMenuHarness);
    await frame.getByRole('button', { name: /options/i }).click();
    await expect(frame.getByRole('menu')).toBeVisible();
    await expect.poll(() => menu.getFocusedItemIndex()).toBe(0);
    await page.keyboard.press('Enter');
    await expect(frame.getByRole('menu')).not.toBeVisible();
    await expect.poll(() => menu.isOpen()).toBe(false);
  });

  test('H-E-c091ef: focus returns to the trigger after choosing an item', async ({ page }) => {
    const { frame } = await gotoStoryWithHarness(page, 'overlays-dropdownmenu--default');
    const trigger = frame.getByRole('button', { name: /options/i });
    await trigger.click();
    await expect(frame.getByRole('menu')).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(frame.getByRole('menu')).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test('H-E-c091ef: focus returns to the trigger after Escape', async ({ page }) => {
    const { frame } = await gotoStoryWithHarness(page, 'overlays-dropdownmenu--default');
    const trigger = frame.getByRole('button', { name: /options/i });
    await trigger.click();
    await expect(frame.getByRole('menu')).toBeVisible();
    // Focus is inside the menu on open — the case where the browser's
    // display:none-on-close would otherwise strand focus on <body>.
    await expect(frame.getByRole('menuitem').first()).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(frame.getByRole('menu')).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test('H-C-07cbc7: panel is start-aligned with the trigger (bottom-start via computePosition)', async ({
    page,
  }) => {
    const { frame } = await gotoStoryWithHarness(page, 'overlays-dropdownmenu--default');
    const trigger = frame.getByRole('button', { name: /options/i });
    await trigger.click();
    const panel = frame.getByRole('menu');
    await expect(panel).toBeVisible();
    const t = await trigger.boundingBox();
    const p = await panel.boundingBox();
    if (!t || !p) throw new Error('missing geometry');
    expect(Math.abs(p.x - t.x)).toBeLessThanOrEqual(1);
  });
});
