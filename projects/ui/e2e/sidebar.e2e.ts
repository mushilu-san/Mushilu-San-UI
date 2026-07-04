import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiSidebarHarness } from '../src/lib/layout/src/testing/sidebar-harness';

test.describe('Sidebar — E2E structural + interaction', () => {
  test('default sidebar starts expanded with the active item marked aria-current', async ({
    page,
  }) => {
    const { loader } = await gotoStoryWithHarness(page, 'layout-sidebar--default');
    const sidebar = await loader.getHarness(MuiSidebarHarness);
    expect(await sidebar.isExpanded()).toBe(true);
    expect(await sidebar.getItemAriaCurrent('Dashboard')).toBe('page');
  });

  test('clicking the trigger collapses the sidebar', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'layout-sidebar--default');
    const sidebar = await loader.getHarness(MuiSidebarHarness);
    expect(await sidebar.isExpanded()).toBe(true);
    await sidebar.toggle();
    await expect.poll(() => sidebar.isExpanded()).toBe(false);
  });

  test('collapsed story starts collapsed and expands on trigger click', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'layout-sidebar--collapsed');
    const sidebar = await loader.getHarness(MuiSidebarHarness);
    expect(await sidebar.isExpanded()).toBe(false);
    await sidebar.toggle();
    await expect.poll(() => sidebar.isExpanded()).toBe(true);
  });

  test('sidebar exposes role="navigation" with a descriptive label', async ({ page }) => {
    const { frame } = await gotoStoryWithHarness(page, 'layout-sidebar--default');
    const nav = frame.getByRole('navigation');
    await expect(nav).toBeVisible();
    await expect(nav).toHaveAttribute('aria-label', 'Sidebar navigation');
  });
});
