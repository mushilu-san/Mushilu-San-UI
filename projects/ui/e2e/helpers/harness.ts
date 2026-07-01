import type { FrameLocator, Page } from '@playwright/test';
import { PlaywrightHarnessEnvironment } from '@ngx-playwright/test';
import type {
  ComponentHarness,
  ComponentHarnessConstructor,
  HarnessLoader,
} from '@angular/cdk/testing';
import { gotoStory } from './story';

/**
 * Navigate to a Storybook story and return a CDK HarnessLoader rooted at the preview
 * iframe's document.
 *
 * We construct `PlaywrightHarnessEnvironment` directly (bypassing the `@ngx-playwright/test`
 * fixtures) so we can pass a frame-scoped `documentRoot` Locator instead of the default
 * top-level page root — components under test live inside `#storybook-preview-iframe`.
 * Skipping the fixture layer also means automatic Angular-stabilization polling is never
 * registered, which matters because this library is zoneless (no Testability to poll).
 */
export async function gotoStoryWithHarness(
  page: Page,
  id: string,
): Promise<{ frame: FrameLocator; loader: HarnessLoader }> {
  const frame = await gotoStory(page, id);
  const documentRoot = frame.locator(':root');
  const loader: HarnessLoader = new PlaywrightHarnessEnvironment(page, {}, documentRoot);
  return { frame, loader };
}

export type { ComponentHarness, ComponentHarnessConstructor, HarnessLoader };
