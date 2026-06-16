import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('Slider — E2E pointer drag', () => {
  test('slider thumb has correct aria-valuemin and aria-valuemax', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-slider--default');
    const thumb = frame.locator('[role="slider"]');
    await expect(thumb).toHaveAttribute('aria-valuemin', '0');
    await expect(thumb).toHaveAttribute('aria-valuemax', '100');
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
    const frame = await gotoStory(page, 'forms-slider--default');
    const track = frame.locator('[part="track"]');
    const box = await track.boundingBox();
    if (!box) throw new Error('Slider track not found');
    // Click at 50% to set a known mid-range value, then press ArrowRight
    await page.mouse.click(box.x + box.width * 0.5, box.y + box.height / 2);
    const before = Number(
      await frame.locator('[role="slider"]').getAttribute('aria-valuenow'),
    );
    await frame.locator('[role="slider"]').press('ArrowRight');
    const after = Number(
      await frame.locator('[role="slider"]').getAttribute('aria-valuenow'),
    );
    expect(after).toBeGreaterThan(before);
  });
});
