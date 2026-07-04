import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiEmptyHarness } from '../src/lib/data-display/src/testing/empty-harness';

test.describe('Empty — E-13 structural & accessibility', () => {
  test('Default story renders title, description, role=status, and projected action', async ({
    page,
  }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'data-display-empty--default');
    const empty = await loader.getHarness(MuiEmptyHarness);
    expect(await empty.getRole()).toBe('status');
    expect(await empty.getTitle()).toBe('No results found');
    expect(await empty.getDescription()).toContain('Try adjusting');
    expect(await empty.hasActionContent()).toBe(true);
    await expect(frame.getByRole('button', { name: 'Clear filters' })).toBeVisible();
  });

  test('NoAction story renders title/description without an action button', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'data-display-empty--no-action');
    const empty = await loader.getHarness(MuiEmptyHarness);
    expect(await empty.getTitle()).toBe('No notifications');
    expect(await empty.hasActionContent()).toBe(false);
    await expect(frame.locator('mui-empty button')).toHaveCount(0);
  });

  test('WithCustomIcon story projects a custom icon into the icon slot', async ({ page }) => {
    const { frame } = await gotoStoryWithHarness(page, 'data-display-empty--with-custom-icon');
    const iconArea = frame.locator('mui-empty [part="icon"]');
    await expect(iconArea).toHaveAttribute('aria-hidden', 'true');
    await expect(iconArea.locator('svg')).toHaveCount(1);
  });
});
