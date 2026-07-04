import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiTypographyHarness } from '../src/lib/data-display/src/testing/typography-harness';

test.describe('Typography — E-13 structural variants', () => {
  test('Default story renders the p variant with projected text', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'data-display-typography--default');
    const typography = await loader.getHarness(MuiTypographyHarness);
    expect(await typography.getVariant()).toBe('p');
    expect(await typography.getText()).toContain('Default paragraph text');
  });

  test('AllVariants story sets data-variant per instance in document order', async ({ page }) => {
    const { frame } = await gotoStoryWithHarness(page, 'data-display-typography--all-variants');
    const items = frame.locator('mui-typography');
    await expect(items).toHaveCount(11);

    const expectedVariants = [
      'h1',
      'h2',
      'h3',
      'h4',
      'lead',
      'p',
      'large',
      'small',
      'muted',
      'code',
      'blockquote',
    ];
    for (const [index, variant] of expectedVariants.entries()) {
      await expect(items.nth(index)).toHaveAttribute('data-variant', variant);
    }
  });

  test('Headings story renders four heading variants with correct text', async ({ page }) => {
    const { frame } = await gotoStoryWithHarness(page, 'data-display-typography--headings');
    const items = frame.locator('mui-typography');
    await expect(items).toHaveCount(4);
    await expect(items.nth(0)).toHaveAttribute('data-variant', 'h1');
    await expect(items.nth(0)).toHaveText('Heading 1');
    await expect(items.nth(3)).toHaveAttribute('data-variant', 'h4');
    await expect(items.nth(3)).toHaveText('Heading 4');
  });
});
