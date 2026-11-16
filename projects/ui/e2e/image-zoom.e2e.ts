import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('ImageZoom — focus management', () => {
  test('opens the dialog, Escape closes it and focus returns to the trigger', async ({ page }) => {
    const frame = await gotoStory(page, 'data-display-imagezoom--default');
    const trigger = frame.getByRole('button', { name: /Enlarge image/ });
    await trigger.click();
    const dialog = frame.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(frame.locator('dialog:focus-within')).toBeAttached();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});
