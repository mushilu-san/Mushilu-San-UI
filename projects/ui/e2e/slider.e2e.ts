import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiSliderHarness } from '../src/lib/forms/src/testing/slider-harness';

test.describe('Slider — E2E pointer drag', () => {
  test('slider thumb has correct aria-valuemin and aria-valuemax', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-slider--default');
    const slider = await loader.getHarness(MuiSliderHarness);
    expect(await slider.getMin()).toBe(0);
    expect(await slider.getMax()).toBe(100);
  });

  test('pointer drag right increases value above 40', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-slider--default');
    const track = frame.locator('[part="track"]');
    const box = await track.boundingBox();
    if (!box) throw new Error('Slider track not found');

    // Current value=40 → handle is at 40% from left edge
    const handleX = box.x + box.width * 0.4;
    const midY = box.y + box.height / 2;

    await page.mouse.move(handleX, midY);
    await page.mouse.down();
    await page.mouse.move(handleX + box.width * 0.3, midY, { steps: 5 });
    await page.mouse.up();

    const valuenow = await frame.locator('[role="slider"]').getAttribute('aria-valuenow');
    expect(Number(valuenow)).toBeGreaterThan(40);
  });

  test('pointer drag left decreases value below 40', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-slider--default');
    const track = frame.locator('[part="track"]');
    const box = await track.boundingBox();
    if (!box) throw new Error('Slider track not found');

    const handleX = box.x + box.width * 0.4;
    const midY = box.y + box.height / 2;

    await page.mouse.move(handleX, midY);
    await page.mouse.down();
    await page.mouse.move(handleX - box.width * 0.2, midY, { steps: 5 });
    await page.mouse.up();

    const valuenow = await frame.locator('[role="slider"]').getAttribute('aria-valuenow');
    expect(Number(valuenow)).toBeLessThan(40);
  });

  test('ArrowRight key increases value', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-slider--default');
    const slider = await loader.getHarness(MuiSliderHarness);
    // Establish a known value via a real commit first — the story's initial two-way-bound
    // `value` doesn't reflect into `aria-valuenow` until the first signal write inside the
    // component (see H-B-<hash> follow-up), matching how the pointer-drag tests above also
    // interact before reading.
    await slider.setToMin();
    // Poll rather than read once: zoneless CD flushes to the DOM asynchronously, and the
    // library's built-in auto-stabilization can't safely target the Storybook iframe (see
    // helpers/harness.ts), so there's no synchronous "wait until settled" available here.
    await expect.poll(() => slider.getValue()).toBe(0);
    const before = await slider.getValue();
    await slider.increment(1);
    await expect.poll(() => slider.getValue()).toBeGreaterThan(before);
  });
});
