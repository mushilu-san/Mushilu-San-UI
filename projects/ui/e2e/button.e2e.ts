import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiButtonHarness } from '../src/lib/primitives/src/testing/button-harness';

test.describe('Button — E2E click + state', () => {
  test('default button is not disabled and can be clicked', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'primitives-button--default');
    const button = await loader.getHarness(MuiButtonHarness);
    expect(await button.isDisabled()).toBe(false);
    expect(await button.isLoading()).toBe(false);
    await button.click(); // must not throw
  });

  test('disabled button is marked aria-disabled and removed from tab order', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'primitives-button--disabled');
    const button = await loader.getHarness(MuiButtonHarness);
    expect(await button.isDisabled()).toBe(true);
    const host = frame.locator('button[aria-disabled="true"]');
    await expect(host).toHaveAttribute('tabindex', '-1');
  });

  test('loading button is marked aria-disabled and aria-busy', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'primitives-button--loading');
    const button = await loader.getHarness(MuiButtonHarness);
    expect(await button.isDisabled()).toBe(true);
    expect(await button.isLoading()).toBe(true);
  });
});
