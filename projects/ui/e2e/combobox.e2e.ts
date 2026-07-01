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
});
