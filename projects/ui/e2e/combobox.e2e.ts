import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiComboboxHarness } from '../src/lib/overlays/src/testing/combobox-harness';

test.describe('Combobox — E-7 open / select / Escape', () => {
  test('clicking trigger opens listbox', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'overlays-combobox--default');
    const combobox = await loader.getHarness(MuiComboboxHarness);
    await frame.locator('button[aria-haspopup="listbox"]').click();
    await expect(frame.getByRole('listbox')).toBeVisible();
    await expect.poll(() => combobox.isOpen()).toBe(true);
  });

  test('Escape closes listbox', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'overlays-combobox--default');
    const combobox = await loader.getHarness(MuiComboboxHarness);
    await frame.locator('button[aria-haspopup="listbox"]').click();
    await expect(frame.getByRole('listbox')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(frame.getByRole('listbox')).not.toBeVisible();
    await expect.poll(() => combobox.isOpen()).toBe(false);
  });

  test('selecting an option closes listbox', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'overlays-combobox--default');
    const combobox = await loader.getHarness(MuiComboboxHarness);
    await frame.locator('button[aria-haspopup="listbox"]').click();
    await expect(frame.getByRole('listbox')).toBeVisible();
    await frame.getByRole('option', { name: /angular/i }).click();
    await expect(frame.getByRole('listbox')).not.toBeVisible();
    await expect.poll(() => combobox.isOpen()).toBe(false);
  });

  test('selected option has aria-selected', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'overlays-combobox--default');
    const combobox = await loader.getHarness(MuiComboboxHarness);
    await frame.locator('button[aria-haspopup="listbox"]').click();
    await expect(frame.getByRole('listbox')).toBeVisible();
    await frame.getByRole('option', { name: /vue/i }).click();
    // Reopen to verify aria-selected
    await frame.locator('button[aria-haspopup="listbox"]').click();
    await expect.poll(() => combobox.isOpen()).toBe(true);
    await expect.poll(() => combobox.isOptionSelected(/vue/i)).toBe(true);
  });

  test('H-E-beee38: focus moves to the search input on open', async ({ page }) => {
    const { frame } = await gotoStoryWithHarness(page, 'overlays-combobox--default');
    await frame.locator('button[aria-haspopup="listbox"]').click();
    await expect(frame.getByRole('listbox')).toBeVisible();
    await expect(frame.getByPlaceholder('Search…')).toBeFocused();
  });

  test('H-E-beee38: typing in the search input filters without needing an extra click', async ({
    page,
  }) => {
    const { frame } = await gotoStoryWithHarness(page, 'overlays-combobox--default');
    await frame.locator('button[aria-haspopup="listbox"]').click();
    await expect(frame.getByRole('listbox')).toBeVisible();
    await page.keyboard.type('vue');
    await expect(frame.getByRole('option', { name: /vue/i })).toBeVisible();
    await expect(frame.getByRole('option', { name: /angular/i })).not.toBeVisible();
  });

  test('H-E-93d6a6: focus returns to the trigger after Escape', async ({ page }) => {
    const { frame } = await gotoStoryWithHarness(page, 'overlays-combobox--default');
    const trigger = frame.locator('button[aria-haspopup="listbox"]');
    await trigger.click();
    await expect(frame.getByRole('listbox')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(frame.getByRole('listbox')).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });
});
