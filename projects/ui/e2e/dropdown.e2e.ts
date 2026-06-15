import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('DropdownMenu — E-2 keyboard navigation', () => {
  test('trigger click opens menu', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-dropdownmenu--default');
    await frame.getByRole('button', { name: /options/i }).click();
    await expect(frame.getByRole('menu')).toBeVisible();
  });

  test('Escape closes menu', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-dropdownmenu--default');
    await frame.getByRole('button', { name: /options/i }).click();
    await expect(frame.getByRole('menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(frame.getByRole('menu')).not.toBeVisible();
  });

  test('ArrowDown moves focus to first item', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-dropdownmenu--default');
    await frame.getByRole('button', { name: /options/i }).click();
    // Wait for menu panel to render before pressing arrow keys
    await expect(frame.getByRole('menu')).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await expect(frame.getByRole('menuitem').first()).toBeFocused();
  });

  test('ArrowDown navigates through items', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-dropdownmenu--default');
    await frame.getByRole('button', { name: /options/i }).click();
    await expect(frame.getByRole('menu')).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await expect(frame.getByRole('menuitem').nth(1)).toBeFocused();
  });

  test('ArrowUp from first item wraps to last', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-dropdownmenu--default');
    await frame.getByRole('button', { name: /options/i }).click();
    await expect(frame.getByRole('menu')).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
    await expect(frame.getByRole('menuitem').last()).toBeFocused();
  });

  test('Enter on a menu item closes menu', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-dropdownmenu--default');
    await frame.getByRole('button', { name: /options/i }).click();
    await expect(frame.getByRole('menu')).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(frame.getByRole('menu')).not.toBeVisible();
  });
});
