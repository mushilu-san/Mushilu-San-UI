import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiTooltipHarness } from '../src/lib/data-display/src/testing/tooltip-harness';

test.describe('Tooltip — E-6 show/hide/positioning', () => {
  test('hover shows tooltip', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'data-display-tooltip--default');
    const trigger = frame.getByRole('button', { name: 'Save' });
    await trigger.hover();
    // Poll: the overlay is appended to <body> asynchronously by the directive's show() —
    // zoneless CD means there's no synchronous "settled" signal to await here.
    await expect
      .poll(async () => (await loader.getHarnessOrNull(MuiTooltipHarness)) !== null)
      .toBe(true);
  });

  test('tooltip text matches muiTooltip binding', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'data-display-tooltip--default');
    await frame.getByRole('button', { name: 'Save' }).hover();
    await expect
      .poll(async () => {
        const tooltip = await loader.getHarnessOrNull(MuiTooltipHarness);
        return tooltip ? await tooltip.getText() : null;
      })
      .toContain('Keyboard shortcut');
  });

  test('mouse leave hides the tooltip', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'data-display-tooltip--default');
    const trigger = frame.getByRole('button', { name: 'Save' });
    await trigger.hover();
    await expect
      .poll(async () => (await loader.getHarnessOrNull(MuiTooltipHarness)) !== null)
      .toBe(true);
    // Move pointer away from the trigger
    await page.mouse.move(0, 0);
    await expect
      .poll(async () => (await loader.getHarnessOrNull(MuiTooltipHarness)) !== null)
      .toBe(false);
  });

  test('focus shows tooltip', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'data-display-tooltip--default');
    await frame.getByRole('button', { name: 'Save' }).focus();
    await expect
      .poll(async () => (await loader.getHarnessOrNull(MuiTooltipHarness)) !== null)
      .toBe(true);
  });

  test('blur hides tooltip', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'data-display-tooltip--default');
    const trigger = frame.getByRole('button', { name: 'Save' });
    await trigger.focus();
    await expect
      .poll(async () => (await loader.getHarnessOrNull(MuiTooltipHarness)) !== null)
      .toBe(true);
    await trigger.blur();
    await expect
      .poll(async () => (await loader.getHarnessOrNull(MuiTooltipHarness)) !== null)
      .toBe(false);
  });

  test('Escape hides tooltip (A-4 — document-level listener)', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'data-display-tooltip--default');
    // Focus the trigger so keyboard events route to the iframe document.
    const trigger = frame.getByRole('button', { name: 'Save' });
    await trigger.focus();
    await expect
      .poll(async () => (await loader.getHarnessOrNull(MuiTooltipHarness)) !== null)
      .toBe(true);
    await page.keyboard.press('Escape');
    await expect
      .poll(async () => (await loader.getHarnessOrNull(MuiTooltipHarness)) !== null)
      .toBe(false);
  });

  test('tooltip has aria-describedby on trigger matching the overlay id', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'data-display-tooltip--default');
    const trigger = frame.getByRole('button', { name: 'Save' });
    await trigger.hover();
    await expect
      .poll(async () => (await loader.getHarnessOrNull(MuiTooltipHarness)) !== null)
      .toBe(true);
    const tooltip = await loader.getHarness(MuiTooltipHarness);
    const id = await tooltip.getId();
    expect(id).toBeTruthy();
    await expect(trigger).toHaveAttribute('aria-describedby', id ?? '');
  });
});
