import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('Tabs — E-2 keyboard navigation', () => {
  test('first tab is active by default', async ({ page }) => {
    const frame = await gotoStory(page, 'navigation-tabs--default');
    await expect(frame.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(frame.getByRole('tabpanel', { name: 'Overview' })).toContainText(
      'Overview content',
    );
  });

  test('ArrowRight moves focus to next tab', async ({ page }) => {
    const frame = await gotoStory(page, 'navigation-tabs--default');
    await frame.getByRole('tab', { name: 'Overview' }).click();
    await page.keyboard.press('ArrowRight');
    await expect(frame.getByRole('tab', { name: 'Activity' })).toBeFocused();
  });

  test('ArrowRight + Enter activates next tab panel', async ({ page }) => {
    const frame = await gotoStory(page, 'navigation-tabs--default');
    await frame.getByRole('tab', { name: 'Overview' }).click();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await expect(frame.getByRole('tabpanel', { name: 'Activity' })).toContainText(
      'Recent activity',
    );
  });

  test('ArrowLeft moves focus to previous tab', async ({ page }) => {
    const frame = await gotoStory(page, 'navigation-tabs--default');
    await frame.getByRole('tab', { name: 'Activity' }).click();
    await page.keyboard.press('ArrowLeft');
    await expect(frame.getByRole('tab', { name: 'Overview' })).toBeFocused();
  });

  test('clicking a tab switches the panel', async ({ page }) => {
    const frame = await gotoStory(page, 'navigation-tabs--default');
    await frame.getByRole('tab', { name: 'Settings' }).click();
    await expect(frame.getByRole('tabpanel', { name: 'Settings' })).toContainText('Configure');
  });
});
