import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('SkipLink — E-11 keyboard', () => {
  test('is hidden until focused, then moves focus to main', async ({ page }) => {
    const frame = await gotoStory(page, 'navigation-skiplink--default');
    const link = frame.getByRole('link', { name: 'Skip to main content' });

    await expect(link).toBeAttached();
    expect((await link.boundingBox())?.width).toBeLessThanOrEqual(1);

    // The first Tab in a Storybook page lands in Storybook's own chrome, so focus the link directly.
    await link.focus();
    await expect(link).toBeFocused();
    expect((await link.boundingBox())?.width).toBeGreaterThan(40);

    await page.keyboard.press('Enter');
    await expect(frame.locator('#main')).toBeFocused();
  });
});
