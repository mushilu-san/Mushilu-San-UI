import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('Dialog — E-1 focus management', () => {
  test('focus moves inside dialog on open', async ({ page }) => {
    const frame = await gotoStory(page, 'feedback-dialog--playground');
    await frame.getByRole('button', { name: 'Open dialog' }).click();
    const dialog = frame.getByRole('dialog');
    await expect(dialog).toBeVisible();
    // dialog:focus-within is true when focus is trapped inside
    await expect(frame.locator('dialog:focus-within')).toBeAttached();
  });

  test('Escape closes the dialog', async ({ page }) => {
    const frame = await gotoStory(page, 'feedback-dialog--playground');
    await frame.getByRole('button', { name: 'Open dialog' }).click();
    await expect(frame.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(frame.getByRole('dialog')).not.toBeVisible();
  });

  test('Cancel button closes the dialog', async ({ page }) => {
    const frame = await gotoStory(page, 'feedback-dialog--playground');
    await frame.getByRole('button', { name: 'Open dialog' }).click();
    await expect(frame.getByRole('dialog')).toBeVisible();
    await frame.getByRole('button', { name: 'Cancel' }).click();
    await expect(frame.getByRole('dialog')).not.toBeVisible();
  });

  test('focus returns to trigger after Escape', async ({ page }) => {
    const frame = await gotoStory(page, 'feedback-dialog--playground');
    const trigger = frame.getByRole('button', { name: 'Open dialog' });
    await trigger.click();
    await expect(frame.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(frame.getByRole('dialog')).not.toBeVisible();
    // Native <dialog> restores focus to the trigger; wait for the event loop to settle
    await expect(trigger).toBeFocused({ timeout: 2000 });
  });

  test('backdrop click closes dialog when closeOnBackdrop=true', async ({ page }) => {
    const frame = await gotoStory(page, 'feedback-dialog--playground');
    await frame.getByRole('button', { name: 'Open dialog' }).click();
    const dialog = frame.getByRole('dialog');
    await expect(dialog).toBeVisible();
    // Dispatch click directly on the <dialog> element — event.target === dialog
    // triggers the onBackdropClick handler (same as a real backdrop click in Chrome)
    await frame.locator('dialog').dispatchEvent('click');
    await expect(dialog).not.toBeVisible();
  });
});
