import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiCarouselHarness } from '../src/lib/data-display/src/testing/carousel-harness';

test.describe('Carousel — E-4 gesture & keyboard navigation', () => {
  test('renders first slide by default', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'data-display-carousel--default');
    const carousel = await loader.getHarness(MuiCarouselHarness);
    await expect.poll(() => carousel.getActiveSlideIndex()).toBe(0);
  });

  test('Next button advances to slide 2', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'data-display-carousel--default');
    const carousel = await loader.getHarness(MuiCarouselHarness);
    await carousel.next();
    // Poll rather than read once: zoneless CD flushes the active-dot binding to the DOM
    // asynchronously, matching the pattern already proven in slider.e2e.ts.
    await expect.poll(() => carousel.getActiveSlideIndex()).toBe(1);
  });

  test('Prev button returns to slide 1', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'data-display-carousel--default');
    const carousel = await loader.getHarness(MuiCarouselHarness);
    await carousel.next();
    await expect.poll(() => carousel.getActiveSlideIndex()).toBe(1);
    await carousel.prev();
    await expect.poll(() => carousel.getActiveSlideIndex()).toBe(0);
  });

  test('pointer swipe left advances to next slide', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'data-display-carousel--default');
    const carousel = await loader.getHarness(MuiCarouselHarness);
    // Use the parent <mui-carousel> since carousel-content translates offscreen
    const carouselEl = frame.locator('mui-carousel');
    const box = await carouselEl.boundingBox();
    if (!box) throw new Error('mui-carousel not found');

    const startX = box.x + box.width * 0.7;
    const endX = box.x + box.width * 0.2;
    const midY = box.y + box.height / 2;

    await page.mouse.move(startX, midY);
    await page.mouse.down();
    await page.mouse.move(endX, midY, { steps: 10 });
    await page.mouse.up();

    await expect.poll(() => carousel.getActiveSlideIndex()).toBe(1);
  });

  test('pointer swipe right returns to previous slide', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'data-display-carousel--default');
    const carousel = await loader.getHarness(MuiCarouselHarness);
    await carousel.next();
    await expect.poll(() => carousel.getActiveSlideIndex()).toBe(1);

    // Use the parent <mui-carousel> — carousel-content is offscreen after transform
    const carouselEl = frame.locator('mui-carousel');
    const box = await carouselEl.boundingBox();
    if (!box) throw new Error('mui-carousel not found');

    const startX = box.x + box.width * 0.2;
    const endX = box.x + box.width * 0.8;
    const midY = box.y + box.height / 2;

    await page.mouse.move(startX, midY);
    await page.mouse.down();
    await page.mouse.move(endX, midY, { steps: 10 });
    await page.mouse.up();

    await expect.poll(() => carousel.getActiveSlideIndex()).toBe(0);
  });
});
