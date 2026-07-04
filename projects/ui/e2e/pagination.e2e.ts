import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiPaginationHarness } from '../src/lib/navigation/src/testing/pagination-harness';

test.describe('Pagination — E-11 page navigation', () => {
  test('first page: prev is disabled, next is enabled', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'navigation-pagination--default');
    const pagination = await loader.getHarness(MuiPaginationHarness);
    expect(await pagination.getCurrentPage()).toBe(1);
    expect(await pagination.isPrevDisabled()).toBe(true);
    expect(await pagination.isNextDisabled()).toBe(false);
  });

  test('last page: next is disabled, prev is enabled', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'navigation-pagination--last-page');
    const pagination = await loader.getHarness(MuiPaginationHarness);
    expect(await pagination.getCurrentPage()).toBe(10);
    expect(await pagination.isNextDisabled()).toBe(true);
    expect(await pagination.isPrevDisabled()).toBe(false);
  });

  test('clicking a page number navigates to that page', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'navigation-pagination--default');
    const pagination = await loader.getHarness(MuiPaginationHarness);
    // Default is page=1/totalPages=10/siblingCount=1 → visible pages are 1, 2, …, 10
    // (3-9 are behind the ellipsis), so 2 is the only non-active page button available.
    await pagination.goToPage(2);
    // Poll rather than read once: zoneless CD flushes page.set() to the DOM asynchronously.
    await expect.poll(() => pagination.getCurrentPage()).toBe(2);
    await expect(frame.getByRole('button', { name: 'Page 2' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('clicking next advances one page', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'navigation-pagination--middle');
    const pagination = await loader.getHarness(MuiPaginationHarness);
    expect(await pagination.getCurrentPage()).toBe(5);
    await pagination.clickNext();
    await expect.poll(() => pagination.getCurrentPage()).toBe(6);
  });

  test('Enter on a focused page button navigates to that page', async ({ page }) => {
    // middle is page=5/totalPages=10/siblingCount=1 → visible pages are 1, …, 4, 5, 6, …, 10,
    // so 4 is a real, focusable non-active page button here.
    const { frame, loader } = await gotoStoryWithHarness(page, 'navigation-pagination--middle');
    const pagination = await loader.getHarness(MuiPaginationHarness);
    await frame.getByRole('button', { name: 'Page 4' }).focus();
    await page.keyboard.press('Enter');
    await expect.poll(() => pagination.getCurrentPage()).toBe(4);
  });
});
