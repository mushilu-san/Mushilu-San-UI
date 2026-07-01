import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiSheetHarness } from '../src/lib/feedback/src/testing/sheet-harness';

test.describe('Sheet — E2E focus management', () => {
  test('focus moves inside sheet on open', async ({ page }) => {
    const frame = await gotoStory(page, 'feedback-sheet--default');
    await frame.getByRole('button', { name: 'Open sheet' }).click();
    await expect(frame.getByRole('dialog')).toBeVisible();
    await expect(frame.locator('dialog:focus-within')).toBeAttached();
  });

  test('Escape closes the sheet', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'feedback-sheet--default');
    await frame.getByRole('button', { name: 'Open sheet' }).click();
    const sheet = await loader.getHarness(MuiSheetHarness);
    // Poll rather than read once: zoneless CD flushes to the DOM asynchronously.
    await expect.poll(() => sheet.isOpen()).toBe(true);
    await page.keyboard.press('Escape');
    await expect.poll(() => sheet.isOpen()).toBe(false);
  });

  test('focus returns to trigger after Escape', async ({ page }) => {
    const frame = await gotoStory(page, 'feedback-sheet--default');
    const trigger = frame.getByRole('button', { name: 'Open sheet' });
    await trigger.click();
    await expect(frame.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(frame.getByRole('dialog')).not.toBeVisible();
    await expect(trigger).toBeFocused({ timeout: 2000 });
  });
});
