import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiAccordionHarness } from '../src/lib/data-display/src/testing/accordion-harness';

test.describe('Accordion — E-13 expand/collapse & keyboard', () => {
  test('all items are collapsed by default', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'data-display-accordion--default');
    const accordion = await loader.getHarness(MuiAccordionHarness);
    expect(await accordion.getItemCount()).toBe(3);
    expect(await accordion.isExpanded(0)).toBe(false);
    expect(await accordion.isExpanded(1)).toBe(false);
    expect(await accordion.isExpanded(2)).toBe(false);
  });

  test('clicking a header expands the panel and sets aria-expanded=true', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'data-display-accordion--default');
    const accordion = await loader.getHarness(MuiAccordionHarness);
    await accordion.toggle(0);
    await expect.poll(() => accordion.isExpanded(0)).toBe(true);
  });

  test('clicking an open header collapses it again (single-open mode)', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'data-display-accordion--default');
    const accordion = await loader.getHarness(MuiAccordionHarness);
    await accordion.toggle(0);
    await expect.poll(() => accordion.isExpanded(0)).toBe(true);
    await accordion.toggle(0);
    await expect.poll(() => accordion.isExpanded(0)).toBe(false);
  });

  test('opening a second item closes the first (single-open mode)', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'data-display-accordion--default');
    const accordion = await loader.getHarness(MuiAccordionHarness);
    await accordion.toggle(0);
    await expect.poll(() => accordion.isExpanded(0)).toBe(true);
    await accordion.toggle(1);
    await expect.poll(() => accordion.isExpanded(1)).toBe(true);
    await expect.poll(() => accordion.isExpanded(0)).toBe(false);
  });

  test('Enter and Space keys both activate the focused trigger (native button semantics)', async ({
    page,
  }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'data-display-accordion--default');
    const accordion = await loader.getHarness(MuiAccordionHarness);
    const trigger = frame.locator('[part="trigger"]').first();

    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect.poll(() => accordion.isExpanded(0)).toBe(true);

    await trigger.focus();
    await page.keyboard.press(' ');
    await expect.poll(() => accordion.isExpanded(0)).toBe(false);
  });
});
