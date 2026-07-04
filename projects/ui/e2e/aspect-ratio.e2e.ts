import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiAspectRatioHarness } from '../src/lib/layout/src/testing/aspect-ratio-harness';

test.describe('AspectRatio — E2E structural', () => {
  test('renders with the default 16:9 ratio', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'layout-aspectratio--default');
    const aspectRatio = await loader.getHarness(MuiAspectRatioHarness);
    expect(await aspectRatio.getRatio()).toBeCloseTo(16 / 9, 3);
  });

  test('square story renders with ratio 1', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'layout-aspectratio--square');
    const aspectRatio = await loader.getHarness(MuiAspectRatioHarness);
    expect(await aspectRatio.getRatio()).toBeCloseTo(1, 3);
  });

  test('constrains rendered box height to the configured ratio', async ({ page }) => {
    const frame = await gotoStory(page, 'layout-aspectratio--default');
    const box = await frame.locator('mui-aspect-ratio').boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;
    expect(box.width / box.height).toBeCloseTo(16 / 9, 1);
  });
});
