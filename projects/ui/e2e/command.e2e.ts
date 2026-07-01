import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiCommandHarness } from '../src/lib/overlays/src/testing/command-harness';

test.describe('Command — E-6 search / keyboard / selection', () => {
  test('input field is visible and focusable', async ({ page }) => {
    const frame = await gotoStory(page, 'overlays-command--default');
    const input = frame.locator('input[type="text"]');
    await expect(input).toBeVisible();
    await input.click();
    await expect(input).toBeFocused();
  });

  test('typing filters visible items', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'overlays-command--default');
    const command = await loader.getHarness(MuiCommandHarness);
    await command.typeSearch('new');
    // Poll rather than read once: zoneless CD flushes to the DOM asynchronously (see
    // helpers/harness.ts), so a bare read immediately after the interaction can flake.
    await expect
      .poll(() => command.getVisibleItemLabels())
      .toEqual([expect.stringContaining('New file'), expect.stringContaining('New folder')]);
  });

  test('ArrowDown navigates through items', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'overlays-command--default');
    const command = await loader.getHarness(MuiCommandHarness);
    const input = frame.locator('input[type="text"]');
    await input.click();
    await page.keyboard.press('ArrowDown');
    await expect.poll(() => command.getHighlightedIndex()).toBe(0);
  });

  test('ArrowUp navigates backward', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'overlays-command--default');
    const command = await loader.getHarness(MuiCommandHarness);
    const input = frame.locator('input[type="text"]');
    await input.click();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
    await expect.poll(() => command.getHighlightedIndex()).toBe(0);
  });
});
