import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiResizableHarness } from '../src/lib/layout/src/testing/resizable-harness';

test.describe('Resizable — E2E pointer drag + keyboard resize', () => {
  test('default story renders two 50/50 panels and one handle', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'layout-resizable--default');
    const resizable = await loader.getHarness(MuiResizableHarness);
    expect(await resizable.getPanelCount()).toBe(2);
    expect(await resizable.getHandleCount()).toBe(1);
    const sizes = await resizable.getPanelSizes();
    expect(sizes[0]).toBeCloseTo(50, 0);
    expect(sizes[1]).toBeCloseTo(50, 0);
  });

  test('three-panels story renders three panels and two handles', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'layout-resizable--three-panels');
    const resizable = await loader.getHarness(MuiResizableHarness);
    expect(await resizable.getPanelCount()).toBe(3);
    expect(await resizable.getHandleCount()).toBe(2);
  });

  test('ArrowRight on the handle grows the leading panel and shrinks the trailing one', async ({
    page,
  }) => {
    const { loader } = await gotoStoryWithHarness(page, 'layout-resizable--with-handle');
    const resizable = await loader.getHarness(MuiResizableHarness);
    const before = await resizable.getPanelSizes();
    await resizable.resizeByKeyboard(0, 3);
    await expect.poll(async () => (await resizable.getPanelSizes())[0]).toBeGreaterThan(before[0]);
    const after = await resizable.getPanelSizes();
    expect(after[1]).toBeLessThan(before[1]);
    expect(after[0] + after[1]).toBeCloseTo(before[0] + before[1], 0);
  });

  test('Shift+ArrowLeft resizes in larger (10%) steps than plain ArrowLeft', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'layout-resizable--with-handle');
    const resizable = await loader.getHarness(MuiResizableHarness);
    const before = await resizable.getPanelSizes();
    await resizable.resizeByKeyboard(0, -1, true);
    await expect.poll(async () => (await resizable.getPanelSizes())[0]).toBeLessThan(before[0]);
    const afterShift = await resizable.getPanelSizes();
    const shiftDelta = before[0] - afterShift[0];
    expect(shiftDelta).toBeCloseTo(10, 0);
  });

  test('vertical story resizes with ArrowDown/ArrowUp on the same panel-A/panel-B contract', async ({
    page,
  }) => {
    const { loader } = await gotoStoryWithHarness(page, 'layout-resizable--vertical');
    const resizable = await loader.getHarness(MuiResizableHarness);
    expect(await resizable.getDirection()).toBe('vertical');
    const before = await resizable.getPanelSizes();
    await resizable.resizeByKeyboard(0, 3);
    await expect.poll(async () => (await resizable.getPanelSizes())[0]).toBeGreaterThan(before[0]);
  });

  test('pointer drag on the handle resizes the adjacent panels', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'layout-resizable--with-handle');
    const resizable = await loader.getHarness(MuiResizableHarness);
    const before = await resizable.getPanelSizes();

    const handle = frame.locator('[part="handle"]');
    const box = await handle.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 60, startY, { steps: 5 });
    await page.mouse.up();

    await expect.poll(async () => (await resizable.getPanelSizes())[0]).toBeGreaterThan(before[0]);
  });

  test('resize is clamped at minSize — dragging far past the edge does not push a panel below its minimum', async ({
    page,
  }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'layout-resizable--three-panels');
    const resizable = await loader.getHarness(MuiResizableHarness);

    const before = await resizable.getPanelSizes();
    const handle = frame.locator('[part="handle"]').first();
    const box = await handle.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    // Drag far left — the ThreePanels story's leading panel has minSize=15.
    await page.mouse.move(startX - 400, startY, { steps: 10 });
    await page.mouse.up();

    // ThreePanels' leading panel has minSize=15 — the drag overshoots the clamp
    // massively, so once the panel stops shrinking it must have settled at the floor.
    await expect.poll(async () => (await resizable.getPanelSizes())[0]).toBeLessThan(before[0]);
    const sizes = await resizable.getPanelSizes();
    expect(sizes[0]).toBeGreaterThanOrEqual(15 - 0.5);
  });
});
