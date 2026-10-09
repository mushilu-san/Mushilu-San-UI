import type { FrameLocator, Page } from '@playwright/test';

/**
 * Navigate to a Storybook story with the `direction` global set to `rtl`
 * (via the `?globals=direction:rtl` URL param). Returns the preview iframe
 * FrameLocator once Angular has bootstrapped and `<html dir="rtl">` is applied.
 */
export async function gotoStoryRtl(page: Page, id: string): Promise<FrameLocator> {
  await page.goto(`/?path=/story/${id}&globals=direction:rtl`);
  const frame = page.frameLocator('#storybook-preview-iframe');
  await frame.locator('[ng-version]').waitFor({ state: 'visible', timeout: 20_000 });
  await frame.locator('html[dir="rtl"]').waitFor({ state: 'attached', timeout: 10_000 });
  return frame;
}
