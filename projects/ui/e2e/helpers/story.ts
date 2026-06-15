import type { FrameLocator, Page } from '@playwright/test';

/**
 * Navigate to a Storybook story and return a FrameLocator scoped to the preview iframe.
 * Waits for Angular to bootstrap inside the iframe before returning.
 */
export async function gotoStory(page: Page, id: string): Promise<FrameLocator> {
  await page.goto(`/?path=/story/${id}`);
  const frame = page.frameLocator('#storybook-preview-iframe');
  // [ng-version] is set by Angular on the root app element once bootstrapped
  await frame.locator('[ng-version]').waitFor({ state: 'visible', timeout: 20_000 });
  return frame;
}
