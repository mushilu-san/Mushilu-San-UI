import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiAlertHarness } from '../src/lib/feedback/src/testing/alert-harness';

test.describe('Alert — E-12 live region + dismiss', () => {
  test('exposes heading and body content via the harness', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'feedback-alert--default');
    const alert = await loader.getHarness(MuiAlertHarness);
    await expect.poll(() => alert.getHeading()).toBe('Heads up');
    await expect.poll(() => alert.getBody()).toBe('Your changes have been saved.');
    await expect.poll(() => alert.isDismissible()).toBe(false);
  });

  test('info/success use role=status (polite); warning/danger use role=alert (assertive)', async ({
    page,
  }) => {
    const { loader } = await gotoStoryWithHarness(page, 'feedback-alert--variants');
    const alerts = await loader.getAllHarnesses(MuiAlertHarness);
    expect(alerts).toHaveLength(4);
    const byVariant = new Map<string | null, MuiAlertHarness>();
    for (const alert of alerts) {
      byVariant.set(await alert.getVariant(), alert);
    }
    await expect.poll(() => byVariant.get('info')!.getRole()).toBe('status');
    await expect.poll(() => byVariant.get('success')!.getRole()).toBe('status');
    await expect.poll(() => byVariant.get('warning')!.getRole()).toBe('alert');
    await expect.poll(() => byVariant.get('danger')!.getRole()).toBe('alert');
  });

  test('clicking the dismiss button emits the dismissed output', async ({ page }) => {
    const frame = await gotoStory(page, 'feedback-alert--dismissible');
    const dismissedEvent = page.waitForEvent('console', {
      predicate: (msg) => msg.text() === 'alert dismissed',
      timeout: 5000,
    });
    await frame.getByRole('button', { name: 'Dismiss' }).click();
    await expect(dismissedEvent).resolves.toBeTruthy();
  });

  test('pressing Escape while focus is inside a dismissible alert emits dismissed', async ({
    page,
  }) => {
    const frame = await gotoStory(page, 'feedback-alert--dismissible');
    await frame.getByRole('button', { name: 'Dismiss' }).focus();
    const dismissedEvent = page.waitForEvent('console', {
      predicate: (msg) => msg.text() === 'alert dismissed',
      timeout: 5000,
    });
    await page.keyboard.press('Escape');
    await expect(dismissedEvent).resolves.toBeTruthy();
  });
});
