import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiTabsHarness } from '../src/lib/navigation/src/testing/tabs-harness';

test.describe('Tabs — E-2 keyboard navigation', () => {
  test('first tab is active by default', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'navigation-tabs--default');
    const tabs = await loader.getHarness(MuiTabsHarness);
    expect(await tabs.isTabSelected('Overview')).toBe(true);
    expect(await tabs.getVisiblePanelText()).toContain('Overview content');
  });

  test('ArrowRight moves focus to next tab', async ({ page }) => {
    // Focus tracking is a raw DOM concept the harness can't meaningfully wrap —
    // keep this on the frame locator, matching how the slider pilot kept its
    // pointer-drag gesture tests raw.
    const frame = await gotoStory(page, 'navigation-tabs--default');
    await frame.getByRole('tab', { name: 'Overview' }).click();
    await page.keyboard.press('ArrowRight');
    await expect(frame.getByRole('tab', { name: 'Activity' })).toBeFocused();
  });

  test('ArrowRight + Enter activates next tab panel', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'navigation-tabs--default');
    const tabs = await loader.getHarness(MuiTabsHarness);
    await frame.getByRole('tab', { name: 'Overview' }).click();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    // Poll rather than read once: zoneless CD flushes to the DOM asynchronously
    // after the Enter keypress, and there's no safe "wait for stable" that
    // targets the Storybook iframe (see helpers/harness.ts).
    await expect.poll(() => tabs.getVisiblePanelText()).toContain('Recent activity');
  });

  test('ArrowLeft moves focus to previous tab', async ({ page }) => {
    const frame = await gotoStory(page, 'navigation-tabs--default');
    await frame.getByRole('tab', { name: 'Activity' }).click();
    await page.keyboard.press('ArrowLeft');
    await expect(frame.getByRole('tab', { name: 'Overview' })).toBeFocused();
  });

  test('clicking a tab switches the panel', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'navigation-tabs--default');
    const tabs = await loader.getHarness(MuiTabsHarness);
    await tabs.selectTab('Settings');
    await expect.poll(() => tabs.getVisiblePanelText()).toContain('Configure');
  });
});
