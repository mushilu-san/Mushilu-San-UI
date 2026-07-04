import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiNavigationMenuHarness } from '../src/lib/navigation/src/testing/navigation-menu-harness';

test.describe('NavigationMenu — E-11 open/close via trigger, Escape, outside click', () => {
  test('clicking a trigger opens its content panel', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(
      page,
      'navigation-navigationmenu--default',
    );
    const menu = await loader.getHarness(MuiNavigationMenuHarness);
    await frame.getByRole('button', { name: 'Getting started' }).click();
    await expect.poll(() => menu.isOpen()).toBe(true);
    await expect.poll(() => menu.isMenuOpen('Getting started')).toBe(true);
    await expect(frame.getByRole('link', { name: 'Introduction' })).toBeVisible();
  });

  test('clicking the open trigger again closes the panel', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(
      page,
      'navigation-navigationmenu--default',
    );
    const menu = await loader.getHarness(MuiNavigationMenuHarness);
    const trigger = frame.getByRole('button', { name: 'Getting started' });
    await trigger.click();
    await expect.poll(() => menu.isOpen()).toBe(true);
    await trigger.click();
    await expect.poll(() => menu.isOpen()).toBe(false);
  });

  test('opening a second trigger closes the first panel', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(
      page,
      'navigation-navigationmenu--default',
    );
    const menu = await loader.getHarness(MuiNavigationMenuHarness);
    await frame.getByRole('button', { name: 'Getting started' }).click();
    await expect.poll(() => menu.isMenuOpen('Getting started')).toBe(true);
    await frame.getByRole('button', { name: 'Components' }).click();
    await expect.poll(() => menu.isMenuOpen('Getting started')).toBe(false);
    await expect.poll(() => menu.isMenuOpen('Components')).toBe(true);
  });

  test('Escape closes the open panel and focus stays on the trigger', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(
      page,
      'navigation-navigationmenu--default',
    );
    const menu = await loader.getHarness(MuiNavigationMenuHarness);
    const trigger = frame.getByRole('button', { name: 'Getting started' });
    await trigger.click();
    await expect.poll(() => menu.isOpen()).toBe(true);
    await page.keyboard.press('Escape');
    await expect.poll(() => menu.isOpen()).toBe(false);
    await expect(trigger).toBeFocused();
  });

  test('clicking outside the menu closes the open panel', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(
      page,
      'navigation-navigationmenu--default',
    );
    const menu = await loader.getHarness(MuiNavigationMenuHarness);
    await frame.getByRole('button', { name: 'Getting started' }).click();
    await expect.poll(() => menu.isOpen()).toBe(true);
    await frame.locator('body').click({ position: { x: 400, y: 300 }, force: true });
    await expect.poll(() => menu.isOpen()).toBe(false);
  });
});
