import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('Tooltip — E-6 show/hide/positioning', () => {
  test('hover shows tooltip', async ({ page }) => {
    const frame = await gotoStory(page, 'data-display-tooltip--default');
    const trigger = frame.getByRole('button', { name: 'Save' });
    await trigger.hover();
    await expect(frame.locator('[role="tooltip"]')).toBeVisible();
  });

  test('tooltip text matches muiTooltip binding', async ({ page }) => {
    const frame = await gotoStory(page, 'data-display-tooltip--default');
    await frame.getByRole('button', { name: 'Save' }).hover();
    await expect(frame.locator('[role="tooltip"]')).toContainText('Keyboard shortcut');
  });

  test('mouse leave hides the tooltip', async ({ page }) => {
    const frame = await gotoStory(page, 'data-display-tooltip--default');
    const trigger = frame.getByRole('button', { name: 'Save' });
    await trigger.hover();
    await expect(frame.locator('[role="tooltip"]')).toBeVisible();
    // Move pointer away from the trigger
    await page.mouse.move(0, 0);
    await expect(frame.locator('[role="tooltip"]')).not.toBeVisible();
  });

  test('focus shows tooltip', async ({ page }) => {
    const frame = await gotoStory(page, 'data-display-tooltip--default');
    await frame.getByRole('button', { name: 'Save' }).focus();
    await expect(frame.locator('[role="tooltip"]')).toBeVisible();
  });

  test('blur hides tooltip', async ({ page }) => {
    const frame = await gotoStory(page, 'data-display-tooltip--default');
    await frame.getByRole('button', { name: 'Save' }).focus();
    await expect(frame.locator('[role="tooltip"]')).toBeVisible();
    await frame.getByRole('button', { name: 'Save' }).blur();
    await expect(frame.locator('[role="tooltip"]')).not.toBeVisible();
  });

  test('Escape hides tooltip (A-4 — document-level listener)', async ({ page }) => {
    const frame = await gotoStory(page, 'data-display-tooltip--default');
    // Focus the trigger so keyboard events route to the iframe document.
    const trigger = frame.getByRole('button', { name: 'Save' });
    await trigger.focus();
    await expect(frame.locator('[role="tooltip"]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(frame.locator('[role="tooltip"]')).not.toBeVisible();
  });

  test('tooltip has aria-describedby on trigger', async ({ page }) => {
    const frame = await gotoStory(page, 'data-display-tooltip--default');
    const trigger = frame.getByRole('button', { name: 'Save' });
    await trigger.hover();
    await expect(trigger).toHaveAttribute('aria-describedby');
  });
});
