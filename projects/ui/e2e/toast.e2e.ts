import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiToastHarness } from '../src/lib/feedback/src/testing/toast-harness';

test.describe('Toast — E-5 lifecycle', () => {
  test('clicking Info shows a toast', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'feedback-toast--playground');
    await frame.getByRole('button', { name: 'Info' }).click();
    // Poll rather than read once: zoneless CD flushes to the DOM asynchronously, and
    // getAllHarnesses()/harness getters don't auto-retry the way locator assertions do.
    await expect
      .poll(() => loader.getAllHarnesses(MuiToastHarness).then((toasts) => toasts.length))
      .toBe(1);
    const [toast] = await loader.getAllHarnesses(MuiToastHarness);
    await expect.poll(() => toast.getMessage()).toBe('A new message arrived.');
  });

  test('dismiss button removes the toast', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'feedback-toast--playground');
    await frame.getByRole('button', { name: 'Info' }).click();
    await expect
      .poll(() => loader.getAllHarnesses(MuiToastHarness).then((toasts) => toasts.length))
      .toBe(1);
    const [toast] = await loader.getAllHarnesses(MuiToastHarness);
    await toast.dismiss();
    await expect
      .poll(() => loader.getAllHarnesses(MuiToastHarness).then((toasts) => toasts.length))
      .toBe(0);
  });

  test('multiple toasts stack in order', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'feedback-toast--playground');
    await frame.getByRole('button', { name: 'Info' }).click();
    await frame.getByRole('button', { name: 'Success' }).click();
    await expect
      .poll(() => loader.getAllHarnesses(MuiToastHarness).then((toasts) => toasts.length))
      .toBe(2);
    const toasts = await loader.getAllHarnesses(MuiToastHarness);
    const messages = await Promise.all(toasts.map((toast) => toast.getMessage()));
    expect(messages).toEqual(['A new message arrived.', 'Your changes were saved.']);
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
    const { frame, loader } = await gotoStoryWithHarness(page, 'feedback-toast--playground');
    await frame.getByRole('button', { name: 'Danger (sticky)' }).click();
    // duration=0 means it won't auto-dismiss — toast stays visible
    await page.waitForTimeout(300);
    await expect
      .poll(() => loader.getAllHarnesses(MuiToastHarness).then((toasts) => toasts.length))
      .toBe(1);
    const [toast] = await loader.getAllHarnesses(MuiToastHarness);
    await expect.poll(() => toast.getVariant()).toBe('danger');
  });
});
