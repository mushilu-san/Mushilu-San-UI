import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiAlertDialogHarness } from '../src/lib/feedback/src/testing/alert-dialog-harness';

test.describe('AlertDialog — E2E focus trap + no-Escape', () => {
  test('focus moves inside alert dialog on open', async ({ page }) => {
    const frame = await gotoStory(page, 'feedback-alertdialog--default');
    await frame.getByRole('button', { name: 'Open dialog' }).click();
    await expect(frame.getByRole('dialog')).toBeVisible();
    await expect(frame.locator('dialog:focus-within')).toBeAttached();
  });

  test('Escape does NOT close the alert dialog', async ({ page }) => {
    const frame = await gotoStory(page, 'feedback-alertdialog--default');
    await frame.getByRole('button', { name: 'Open dialog' }).click();
    const dialog = frame.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    // Dialog must remain open — this is the key AlertDialog invariant
    await expect(dialog).toBeVisible();
  });

  test('Cancel button closes the alert dialog', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'feedback-alertdialog--default');
    await frame.getByRole('button', { name: 'Open dialog' }).click();
    const dialog = await loader.getHarness(MuiAlertDialogHarness);
    // Poll rather than read once: zoneless CD flushes to the DOM asynchronously.
    await expect.poll(() => dialog.isOpen()).toBe(true);
    await dialog.cancel();
    await expect.poll(() => dialog.isOpen()).toBe(false);
  });

  test('Confirm button closes the alert dialog', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'feedback-alertdialog--default');
    await frame.getByRole('button', { name: 'Open dialog' }).click();
    const dialog = await loader.getHarness(MuiAlertDialogHarness);
    await expect.poll(() => dialog.isOpen()).toBe(true);
    await dialog.confirm();
    await expect.poll(() => dialog.isOpen()).toBe(false);
  });
});
