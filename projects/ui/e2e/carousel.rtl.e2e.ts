import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';
import { gotoStoryRtl } from './helpers/rtl';

// Chevron transforms are the only direction-dependent visual in the nav buttons.
const chevronTransform = (frame: Awaited<ReturnType<typeof gotoStory>>, which: 'Prev' | 'Next') =>
  frame.locator(`button[muiCarousel${which}] svg`).evaluate((el) => getComputedStyle(el).transform);

test.describe('Carousel — RTL chevrons (#584)', () => {
  test('prev/next chevrons are not mirrored in LTR', async ({ page }) => {
    const frame = await gotoStory(page, 'data-display-carousel--default');
    expect(await chevronTransform(frame, 'Prev')).toBe('matrix(1, 0, 0, 1, 0, 0)');
    expect(await chevronTransform(frame, 'Next')).toBe('matrix(1, 0, 0, 1, 0, 0)');
  });

  test('prev/next chevrons mirror under dir=rtl', async ({ page }) => {
    const frame = await gotoStoryRtl(page, 'data-display-carousel--default');
    await expect.poll(() => chevronTransform(frame, 'Prev')).toBe('matrix(-1, 0, 0, 1, 0, 0)');
    expect(await chevronTransform(frame, 'Next')).toBe('matrix(-1, 0, 0, 1, 0, 0)');
  });
});
