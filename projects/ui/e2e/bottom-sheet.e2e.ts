import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiBottomSheetHarness } from '../src/lib/mobile/src/testing/bottom-sheet-harness';

test.describe('BottomSheet — E2E focus management', () => {
  test('focus moves inside bottom sheet on open', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'mobile-bottomsheet--default');
    const sheet = await loader.getHarness(MuiBottomSheetHarness);
    await frame.getByRole('button', { name: 'Open Sheet' }).click();
    // Poll after the interaction: zoneless CD flushes to the DOM asynchronously.
    await expect.poll(() => sheet.isOpen()).toBe(true);
    await expect(frame.locator('dialog:focus-within')).toBeAttached();
  });

  test('Escape closes the bottom sheet', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'mobile-bottomsheet--default');
    const sheet = await loader.getHarness(MuiBottomSheetHarness);
    await frame.getByRole('button', { name: 'Open Sheet' }).click();
    await expect.poll(() => sheet.isOpen()).toBe(true);
    await page.keyboard.press('Escape');
    await expect.poll(() => sheet.isOpen()).toBe(false);
  });

  test('focus returns to trigger after Escape', async ({ page }) => {
    // Raw locators here: focus-return is a page-level focus assertion, not component state
    // a harness would meaningfully simplify.
    const frame = await gotoStory(page, 'mobile-bottomsheet--default');
    const trigger = frame.getByRole('button', { name: 'Open Sheet' });
    await trigger.click();
    await expect(frame.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(frame.getByRole('dialog')).not.toBeVisible();
    await expect(trigger).toBeFocused({ timeout: 2000 });
  });
});
