import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('Chip — E-11 pointer target and state', () => {
  test('a link chip is 32px tall with a 44px pointer target', async ({ page }) => {
    const frame = await gotoStory(page, 'primitives-chip--default');
    const chip = frame.getByRole('link', { name: 'angular' });
    const box = await chip.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(32);
    expect(box?.height).toBeLessThan(40);
    const target = await chip.evaluate((el) => {
      const s = getComputedStyle(el, '::before');
      return { top: parseFloat(s.top), bottom: parseFloat(s.bottom) };
    });
    expect(target.top).toBeLessThanOrEqual(-6);
    expect(target.bottom).toBeLessThanOrEqual(-6);
  });

  test('a toggle chip flips aria-pressed on click', async ({ page }) => {
    const frame = await gotoStory(page, 'primitives-chip--toggle');
    const chip = frame.getByRole('button', { name: 'Filter' });
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
    await chip.click();
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
  });
});
