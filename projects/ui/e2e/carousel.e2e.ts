import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('Carousel — E-4 gesture & keyboard navigation', () => {
  test('renders first slide by default', async ({ page }) => {
    const frame = await gotoStory(page, 'data-display-carousel--default');
    const dots = frame.getByRole('tab');
    await expect(dots.first()).toHaveAttribute('aria-selected', 'true');
  });

  test('Next button advances to slide 2', async ({ page }) => {
    const frame = await gotoStory(page, 'data-display-carousel--default');
    await frame.getByRole('button', { name: 'Next slide' }).click();
    const dots = frame.getByRole('tab');
    await expect(dots.nth(1)).toHaveAttribute('aria-selected', 'true');
  });

  test('Prev button returns to slide 1', async ({ page }) => {
    const frame = await gotoStory(page, 'data-display-carousel--default');
    await frame.getByRole('button', { name: 'Next slide' }).click();
    await frame.getByRole('button', { name: 'Previous slide' }).click();
    const dots = frame.getByRole('tab');
    await expect(dots.first()).toHaveAttribute('aria-selected', 'true');
  });

  test('pointer swipe left advances to next slide', async ({ page }) => {
    const frame = await gotoStory(page, 'data-display-carousel--default');
    // Use the parent <mui-carousel> since carousel-content translates offscreen
    const carousel = frame.locator('mui-carousel');
    const box = await carousel.boundingBox();
    if (!box) throw new Error('mui-carousel not found');

    const startX = box.x + box.width * 0.7;
    const endX = box.x + box.width * 0.2;
    const midY = box.y + box.height / 2;

    await page.mouse.move(startX, midY);
    await page.mouse.down();
    await page.mouse.move(endX, midY, { steps: 10 });
    await page.mouse.up();

    const dots = frame.getByRole('tab');
    await expect(dots.nth(1)).toHaveAttribute('aria-selected', 'true');
  });

  test('pointer swipe right returns to previous slide', async ({ page }) => {
    const frame = await gotoStory(page, 'data-display-carousel--default');
    await frame.getByRole('button', { name: 'Next slide' }).click();
    await expect(frame.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');

    // Use the parent <mui-carousel> — carousel-content is offscreen after transform
    const carousel = frame.locator('mui-carousel');
    const box = await carousel.boundingBox();
    if (!box) throw new Error('mui-carousel not found');

    const startX = box.x + box.width * 0.2;
    const endX = box.x + box.width * 0.8;
    const midY = box.y + box.height / 2;

    await page.mouse.move(startX, midY);
    await page.mouse.down();
    await page.mouse.move(endX, midY, { steps: 10 });
    await page.mouse.up();

    const dots = frame.getByRole('tab');
    await expect(dots.first()).toHaveAttribute('aria-selected', 'true');
  });
});
