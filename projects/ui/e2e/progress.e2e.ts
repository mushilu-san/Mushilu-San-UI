import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiProgressHarness } from '../src/lib/feedback/src/testing/progress-harness';

test.describe('Progress — E-12 ARIA value reflection', () => {
  test('Default story reflects value/min/max/label via ARIA attributes', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'feedback-progress--default');
    const progress = await loader.getHarness(MuiProgressHarness);
    await expect.poll(() => progress.getValueNow()).toBe(45);
    await expect.poll(() => progress.getValueMin()).toBe(0);
    await expect.poll(() => progress.getValueMax()).toBe(100);
    await expect.poll(() => progress.getLabel()).toBe('Loading');
    await expect.poll(() => progress.getVariant()).toBe('linear');
  });

  test('Indeterminate story omits aria-valuenow/min/max and sets aria-busy', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'feedback-progress--indeterminate');
    const bars = await loader.getAllHarnesses(MuiProgressHarness);
    expect(bars).toHaveLength(2);
    for (const bar of bars) {
      await expect.poll(() => bar.isIndeterminate()).toBe(true);
      await expect.poll(() => bar.isBusy()).toBe(true);
      await expect.poll(() => bar.getValueNow()).toBeNull();
      await expect.poll(() => bar.getValueMin()).toBeNull();
      await expect.poll(() => bar.getValueMax()).toBeNull();
    }
  });

  test('Circular story renders circular variant bars with their own values', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'feedback-progress--circular');
    const bars = await loader.getAllHarnesses(MuiProgressHarness);
    expect(bars).toHaveLength(3);
    for (const bar of bars) {
      await expect.poll(() => bar.getVariant()).toBe('circular');
      await expect.poll(() => bar.isIndeterminate()).toBe(false);
    }
    const values = await Promise.all(bars.map((bar) => bar.getValueNow()));
    expect(values).toEqual([25, 60, 90]);
  });

  test('LinearSizes story reflects size via data-size', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'feedback-progress--linear-sizes');
    const bars = await loader.getAllHarnesses(MuiProgressHarness);
    const sizes = await Promise.all(bars.map((bar) => bar.getSize()));
    expect(sizes).toEqual(['sm', 'md', 'lg']);
  });
});
