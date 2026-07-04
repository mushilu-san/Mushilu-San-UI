import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiTableHarness } from '../src/lib/data-display/src/testing/table-harness';

test.describe('Table — E-13 structure & sorting', () => {
  test('Default story renders the correct columns, row count, and cell values', async ({
    page,
  }) => {
    const { loader } = await gotoStoryWithHarness(page, 'data-display-table--default');
    const table = await loader.getHarness(MuiTableHarness);
    expect(await table.getColumnHeaders()).toEqual(['Name', 'Email', 'Role', 'Joined']);
    expect(await table.getRowCount()).toBe(4);
    expect(await table.getCellText(0, 0)).toBe('Alice Chen');
    expect(await table.getCellText(1, 1)).toBe('bob@example.com');
  });

  test('non-sortable columns render as plain text with no sort button', async ({ page }) => {
    const { frame } = await gotoStoryWithHarness(page, 'data-display-table--default');
    const nameHeader = frame.locator('[part="th"]').first();
    await expect(nameHeader.locator('[part="sort-btn"]')).toHaveCount(0);
    await expect(nameHeader).toHaveText('Name');
  });

  test('clicking a sortable header cycles aria-sort: none -> ascending -> descending -> none', async ({
    page,
  }) => {
    const { loader } = await gotoStoryWithHarness(page, 'data-display-table--default');
    const table = await loader.getHarness(MuiTableHarness);

    expect(await table.getSortDirectionByLabel('Role')).toBeNull();

    await table.sortByLabel('Role');
    await expect.poll(() => table.getSortDirectionByLabel('Role')).toBe('ascending');

    await table.sortByLabel('Role');
    await expect.poll(() => table.getSortDirectionByLabel('Role')).toBe('descending');

    await table.sortByLabel('Role');
    await expect.poll(() => table.getSortDirectionByLabel('Role')).toBeNull();
  });

  test('WithCaption story renders a visible caption as the table accessible name', async ({
    page,
  }) => {
    const { frame } = await gotoStoryWithHarness(page, 'data-display-table--with-caption');
    await expect(frame.locator('[part="caption"]')).toHaveText('Team members');
    await expect(frame.locator('mui-table')).toHaveAttribute(
      'aria-labelledby',
      /mui-table-caption/,
    );
  });
});
