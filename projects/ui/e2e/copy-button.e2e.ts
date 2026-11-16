import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('CopyButton', () => {
  test('Enter activates the button and the copied label is announced', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const frame = await gotoStory(page, 'primitives-copybutton--default');
    await frame.getByRole('button', { name: 'Copy' }).focus();
    await page.keyboard.press('Enter');
    await expect(frame.getByRole('status')).toHaveText('Copied');
  });
});
