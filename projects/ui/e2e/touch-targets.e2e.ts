import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('Touch targets — WCAG 2.5.5 44px minimum', () => {
  test('H-A-2e8dc5: Checkbox meets the 44px minimum at every size', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-checkbox--sizes');
    const boxes = await frame.locator('input[type="checkbox"]').all();
    expect(boxes.length).toBe(3);
    for (const box of boxes) {
      const rect = await box.boundingBox();
      expect(rect?.width).toBeGreaterThanOrEqual(44);
      expect(rect?.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('H-A-96eafe: Radio meets the 44px minimum at every size', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-radio--sizes');
    const boxes = await frame.locator('input[type="radio"]').all();
    expect(boxes.length).toBe(3);
    for (const box of boxes) {
      const rect = await box.boundingBox();
      expect(rect?.width).toBeGreaterThanOrEqual(44);
      expect(rect?.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('H-A-5dcd59: Toggle meets the 44px minimum at every size', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-toggle--sizes');
    const boxes = await frame.locator('mui-toggle').all();
    expect(boxes.length).toBe(3);
    for (const box of boxes) {
      const rect = await box.boundingBox();
      expect(rect?.width).toBeGreaterThanOrEqual(44);
      expect(rect?.height).toBeGreaterThanOrEqual(44);
    }
  });
});
