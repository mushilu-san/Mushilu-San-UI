import { test, expect } from '@playwright/test';
import { gotoStoryRtl } from './helpers/rtl';

test.describe('Layout / data display — RTL', () => {
  test('Resizable: ArrowLeft grows the leading panel, ArrowRight shrinks it', async ({ page }) => {
    const frame = await gotoStoryRtl(page, 'layout-resizable--with-handle');
    const panel = frame.locator('[part="panel"]').first();
    const size = async () => {
      const style = (await panel.getAttribute('style')) ?? '';
      return Number.parseFloat(/flex-basis:\s*([\d.]+)%/.exec(style)?.[1] ?? 'NaN');
    };
    const before = await size();
    await frame.getByRole('separator').first().focus();
    await page.keyboard.press('ArrowLeft');
    await expect.poll(size).toBeGreaterThan(before);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await expect.poll(size).toBeLessThan(before);
  });

  test('Carousel: ArrowLeft advances, ArrowRight goes back', async ({ page }) => {
    const frame = await gotoStoryRtl(page, 'data-display-carousel--default');
    const dots = frame.locator('[part="dot"]');
    const activeIndex = async () => {
      const n = await dots.count();
      for (let i = 0; i < n; i++) {
        if ((await dots.nth(i).getAttribute('aria-selected')) === 'true') return i;
      }
      return -1;
    };
    await dots.first().focus();
    await page.keyboard.press('ArrowLeft');
    await expect.poll(activeIndex).toBe(1);
    await page.keyboard.press('ArrowRight');
    await expect.poll(activeIndex).toBe(0);
  });
});
