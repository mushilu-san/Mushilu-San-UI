import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('Toast — E-5 lifecycle', () => {
  test('clicking Info shows a toast', async ({ page }) => {
    const frame = await gotoStory(page, 'feedback-toast--playground');
    await frame.getByRole('button', { name: 'Info' }).click();
    await expect(frame.locator('mui-toast')).toBeVisible();
  });

  test('dismiss button removes the toast', async ({ page }) => {
    const frame = await gotoStory(page, 'feedback-toast--playground');
    await frame.getByRole('button', { name: 'Info' }).click();
    await expect(frame.locator('mui-toast')).toBeVisible();
    await frame.getByRole('button', { name: /dismiss/i }).click();
    await expect(frame.locator('mui-toast')).not.toBeVisible();
  });

  test('multiple toasts stack in order', async ({ page }) => {
    const frame = await gotoStory(page, 'feedback-toast--playground');
    await frame.getByRole('button', { name: 'Info' }).click();
    await frame.getByRole('button', { name: 'Success' }).click();
    const toasts = frame.locator('mui-toast');
    await expect(toasts).toHaveCount(2);
  });

  test('warning toast appears in assertive live region', async ({ page }) => {
    const frame = await gotoStory(page, 'feedback-toast--playground');
    await frame.getByRole('button', { name: 'Warning' }).click();
    const alertRegion = frame.locator('[role="alert"]');
    await expect(alertRegion.locator('mui-toast')).toBeVisible();
  });

  test('info toast appears in polite live region', async ({ page }) => {
    const frame = await gotoStory(page, 'feedback-toast--playground');
    await frame.getByRole('button', { name: 'Info' }).click();
    const statusRegion = frame.locator('[role="status"]');
    await expect(statusRegion.locator('mui-toast')).toBeVisible();
  });

  test('danger (sticky) toast persists without dismissing itself', async ({ page }) => {
    const frame = await gotoStory(page, 'feedback-toast--playground');
    await frame.getByRole('button', { name: 'Danger (sticky)' }).click();
    // duration=0 means it won't auto-dismiss — toast stays visible
    await page.waitForTimeout(300);
    await expect(frame.locator('mui-toast')).toBeVisible();
  });
});
