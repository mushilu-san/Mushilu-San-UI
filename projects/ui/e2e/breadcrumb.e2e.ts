import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiBreadcrumbHarness } from '../src/lib/navigation/src/testing/breadcrumb-harness';

test.describe('Breadcrumb — E-11 structure & keyboard', () => {
  test('renders links for every item except the last, current one', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'navigation-breadcrumb--default');
    const breadcrumb = await loader.getHarness(MuiBreadcrumbHarness);
    expect(await breadcrumb.getLinkLabels()).toEqual(['Home', 'Products']);
    expect(await breadcrumb.getCurrentLabel()).toBe('Shoes');
  });

  test('the current page item is not a link and carries aria-current="page"', async ({ page }) => {
    const frame = await gotoStory(page, 'navigation-breadcrumb--default');
    await expect(frame.getByText('Shoes')).toHaveAttribute('aria-current', 'page');
    // Only the two non-terminal items are rendered as real links.
    await expect(frame.getByRole('link')).toHaveCount(2);
  });

  test('separators are decorative and excluded from the accessibility tree', async ({ page }) => {
    const frame = await gotoStory(page, 'navigation-breadcrumb--default');
    const separators = frame.locator('[part="separator"]');
    await expect(separators).toHaveCount(2);
    for (const separator of await separators.all()) {
      await expect(separator).toHaveAttribute('aria-hidden', 'true');
    }
  });

  test('Tab moves focus through breadcrumb links in order', async ({ page }) => {
    const frame = await gotoStory(page, 'navigation-breadcrumb--default');
    await frame.getByRole('link', { name: 'Home' }).focus();
    await expect(frame.getByRole('link', { name: 'Home' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(frame.getByRole('link', { name: 'Products' })).toBeFocused();
  });
});
