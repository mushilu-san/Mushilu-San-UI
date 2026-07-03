import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiSkeletonHarness } from '../src/lib/feedback/src/testing/skeleton-harness';

test.describe('Skeleton — E-12 loading placeholder semantics', () => {
  test('Default story renders one item per configured line, hidden from assistive tech', async ({
    page,
  }) => {
    const { loader } = await gotoStoryWithHarness(page, 'feedback-skeleton--default');
    const skeleton = await loader.getHarness(MuiSkeletonHarness);
    await expect.poll(() => skeleton.getVariant()).toBe('text');
    await expect.poll(() => skeleton.getItemCount()).toBe(3);
    await expect.poll(() => skeleton.isHiddenFromAssistiveTech()).toBe(true);
  });

  test('Variants story renders a single item for rect/circle regardless of lines', async ({
    page,
  }) => {
    const { loader } = await gotoStoryWithHarness(page, 'feedback-skeleton--variants');
    const skeletons = await loader.getAllHarnesses(MuiSkeletonHarness);
    expect(skeletons).toHaveLength(3);
    const byVariant = new Map<string | null, MuiSkeletonHarness>();
    for (const skeleton of skeletons) {
      byVariant.set(await skeleton.getVariant(), skeleton);
    }
    await expect.poll(() => byVariant.get('text')!.getItemCount()).toBe(3);
    await expect.poll(() => byVariant.get('rect')!.getItemCount()).toBe(1);
    await expect.poll(() => byVariant.get('circle')!.getItemCount()).toBe(1);
  });

  test('Accessibility story marks the surrounding region busy while items stay hidden', async ({
    page,
  }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'feedback-skeleton--accessibility');
    const busyRegion = frame.locator('[role="status"][aria-busy="true"]');
    await expect(busyRegion.locator('mui-skeleton')).toHaveCount(2);

    const skeletons = await loader.getAllHarnesses(MuiSkeletonHarness);
    for (const skeleton of skeletons) {
      await expect.poll(() => skeleton.isHiddenFromAssistiveTech()).toBe(true);
    }
  });
});
