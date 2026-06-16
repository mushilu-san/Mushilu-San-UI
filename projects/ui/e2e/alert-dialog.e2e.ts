import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

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
    const frame = await gotoStory(page, 'feedback-alertdialog--default');
    await frame.getByRole('button', { name: 'Open dialog' }).click();
    await expect(frame.getByRole('dialog')).toBeVisible();
    await frame.getByRole('button', { name: 'Cancel' }).click();
    await expect(frame.getByRole('dialog')).not.toBeVisible();
  });

  test('Confirm button closes the alert dialog', async ({ page }) => {
    const frame = await gotoStory(page, 'feedback-alertdialog--default');
    await frame.getByRole('button', { name: 'Open dialog' }).click();
    await expect(frame.getByRole('dialog')).toBeVisible();
    await frame.getByRole('button', { name: 'Confirm' }).click();
    await expect(frame.getByRole('dialog')).not.toBeVisible();
  });
});
