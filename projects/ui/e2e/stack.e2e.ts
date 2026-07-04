import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiStackHarness } from '../src/lib/layout/src/testing/stack-harness';

test.describe('Stack — E2E structural', () => {
  test('default story stacks children in a column', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'layout-stack--default');
    const stack = await loader.getHarness(MuiStackHarness);
    expect(await stack.getDirection()).toBe('column');
  });

  test('row direction story lays children out horizontally', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'layout-stack--direction');
    const stacks = await loader.getAllHarnesses(MuiStackHarness);
    expect(await stacks[0].getDirection()).toBe('column');
    expect(await stacks[1].getDirection()).toBe('row');
  });

  test('stack children render in DOM order matching source order', async ({ page }) => {
    const { frame } = await gotoStoryWithHarness(page, 'layout-stack--default');
    const items = frame.locator('mui-stack > div');
    await expect(items).toHaveCount(3);
    await expect(items.first()).toContainText('Item one');
    await expect(items.last()).toContainText('Item three');
  });
});
