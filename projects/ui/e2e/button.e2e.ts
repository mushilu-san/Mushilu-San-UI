import { test, expect, type FrameLocator } from '@playwright/test';
import { gotoStory } from './helpers/story';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiButtonHarness } from '../src/lib/primitives/src/testing/button-harness';

test.describe('Button — E2E click + state', () => {
  test('default button is not disabled and can be clicked', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'primitives-button--default');
    const button = await loader.getHarness(MuiButtonHarness);
    expect(await button.isDisabled()).toBe(false);
    expect(await button.isLoading()).toBe(false);
    await button.click(); // must not throw
  });

  test('disabled button is marked aria-disabled and removed from tab order', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'primitives-button--disabled');
    const button = await loader.getHarness(MuiButtonHarness);
    expect(await button.isDisabled()).toBe(true);
    const host = frame.locator('button[aria-disabled="true"]');
    await expect(host).toHaveAttribute('tabindex', '-1');
  });

  test('loading button is marked aria-disabled and aria-busy', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'primitives-button--loading');
    const button = await loader.getHarness(MuiButtonHarness);
    expect(await button.isDisabled()).toBe(true);
    expect(await button.isLoading()).toBe(true);
  });

  test.describe('A-8 #707: destructive contrast in dark theme', () => {
    // Force dark tokens and freeze transitions so colours are read settled,
    // not mid-animation (the button animates background-color over 0.1s).
    const enableDarkWithoutTransitions = async (frame: FrameLocator) => {
      await frame.locator('html').evaluate((el) => {
        el.setAttribute('data-theme', 'dark');
        const style = document.createElement('style');
        style.textContent = '*, *::before, *::after { transition: none !important; }';
        document.head.appendChild(style);
      });
    };
    // WCAG 2.x relative luminance and contrast ratio, computed in-page from the
    // computed colours so the check uses the real --mui-* token values.
    const contrastScript = `(el) => {
      const parse = (c) => c.match(/[\\d.]+/g).slice(0, 3).map(Number);
      const lin = (v) => { const x = v / 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
      const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
      const cs = getComputedStyle(el);
      const a = lum(parse(cs.color)), b = lum(parse(cs.backgroundColor));
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    }`;

    test('default destructive button meets 4.5:1', async ({ page }) => {
      const frame = await gotoStory(page, 'primitives-button--destructive');
      await enableDarkWithoutTransitions(frame);
      const btn = frame.locator('button[muiButton]').first();
      const ratio = await btn.evaluate(
        (el, src) => new Function('return ' + src)()(el),
        contrastScript,
      );
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    test('hovered destructive button meets 4.5:1', async ({ page }) => {
      const frame = await gotoStory(page, 'primitives-button--destructive');
      await enableDarkWithoutTransitions(frame);
      const btn = frame.locator('button[muiButton]').first();
      await btn.hover();
      const ratio = await btn.evaluate(
        (el, src) => new Function('return ' + src)()(el),
        contrastScript,
      );
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    test('pressed destructive button meets 4.5:1', async ({ page }) => {
      const frame = await gotoStory(page, 'primitives-button--destructive');
      await enableDarkWithoutTransitions(frame);
      const btn = frame.locator('button[muiButton]').first();
      await btn.hover();
      await page.mouse.down();
      const ratio = await btn.evaluate(
        (el, src) => new Function('return ' + src)()(el),
        contrastScript,
      );
      await page.mouse.up();
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });
});
