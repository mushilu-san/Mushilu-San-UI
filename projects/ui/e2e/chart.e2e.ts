import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiChartHarness } from '../src/lib/data-display/src/testing/chart-harness';

test.describe('Chart — E-13 rendering & accessibility', () => {
  test('host has role=figure and canvas has role=img with the label input as aria-label', async ({
    page,
  }) => {
    const { loader } = await gotoStoryWithHarness(page, 'data-display-chart--default');
    const chart = await loader.getHarness(MuiChartHarness);
    expect(await chart.getHostRole()).toBe('figure');
    expect(await chart.getCanvasRole()).toBe('img');
    expect(await chart.getLabel()).toBe('Monthly Revenue');
  });

  test('canvas has a unique id prefixed with mui-chart-canvas', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'data-display-chart--default');
    const chart = await loader.getHarness(MuiChartHarness);
    expect(await chart.getCanvasId()).toMatch(/^mui-chart-canvas-/);
  });

  test('BarChart story renders a canvas whose aria-label matches its data', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'data-display-chart--bar-chart');
    const chart = await loader.getHarness(MuiChartHarness);
    expect(await chart.getLabel()).toBe('Monthly Revenue');
  });

  test('LineChart story renders a canvas with its own aria-label', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'data-display-chart--line-chart');
    const chart = await loader.getHarness(MuiChartHarness);
    expect(await chart.getLabel()).toBe('Weekly Active Users');
  });

  test('canvas renders with non-zero dimensions', async ({ page }) => {
    const { frame } = await gotoStoryWithHarness(page, 'data-display-chart--default');
    const box = await frame.locator('canvas').boundingBox();
    expect(box?.width).toBeGreaterThan(0);
    expect(box?.height).toBeGreaterThan(0);
  });
});
