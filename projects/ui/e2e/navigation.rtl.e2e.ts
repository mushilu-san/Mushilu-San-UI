import { test, expect } from '@playwright/test';
import { gotoStoryRtl } from './helpers/rtl';

test.describe('Navigation — RTL keyboard', () => {
  test('Tabs: ArrowRight moves focus to the previous tab', async ({ page }) => {
    const frame = await gotoStoryRtl(page, 'navigation-tabs--default');
    await frame.getByRole('tab', { name: 'Activity' }).click();
    await page.keyboard.press('ArrowRight');
    await expect(frame.getByRole('tab', { name: 'Overview' })).toBeFocused();
  });

  test('Tabs: ArrowLeft moves focus to the next tab', async ({ page }) => {
    const frame = await gotoStoryRtl(page, 'navigation-tabs--default');
    await frame.getByRole('tab', { name: 'Overview' }).click();
    await page.keyboard.press('ArrowLeft');
    await expect(frame.getByRole('tab', { name: 'Activity' })).toBeFocused();
  });

  test('Menubar: ArrowLeft moves focus to the next trigger', async ({ page }) => {
    const frame = await gotoStoryRtl(page, 'navigation-menubar--default');
    await frame.getByRole('menuitem', { name: 'File', exact: true }).click();
    await page.keyboard.press('Escape'); // close, keep focus on File trigger
    await page.keyboard.press('ArrowLeft');
    await expect(frame.getByRole('menuitem', { name: 'Edit' })).toBeFocused();
  });

  test('Menubar: ArrowRight moves focus to the previous trigger', async ({ page }) => {
    const frame = await gotoStoryRtl(page, 'navigation-menubar--default');
    await frame.getByRole('menuitem', { name: 'Edit', exact: true }).click();
    await page.keyboard.press('Escape');
    await page.keyboard.press('ArrowRight');
    await expect(frame.getByRole('menuitem', { name: 'File', exact: true })).toBeFocused();
  });
});
