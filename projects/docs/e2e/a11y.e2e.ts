import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

// Known library gaps. Each entry disables only the listed axe rules on that one page, and names
// the audit finding that tracks the fix. Remove the entry when the finding is resolved.
const KNOWN_AXE_ISSUES: Record<string, { rules: string[]; finding: string }> = {
  command: {
    rules: ['aria-input-field-name', 'aria-required-children', 'color-contrast'],
    finding: 'A-13',
  },
  resizable: { rules: ['aria-required-attr'], finding: 'A-14' },
  'scroll-area': { rules: ['scrollable-region-focusable'], finding: 'A-15' },
  slider: { rules: ['aria-input-field-name'], finding: 'A-16' },
  'swipe-action': { rules: ['aria-required-children'], finding: 'A-17' },
};

// Every component page is checked, so a new docs page is covered without editing this list.
const componentSlugs = readdirSync(join(__dirname, '..', 'src', 'content', 'components')).sort();
const PAGES = [
  '/',
  '/getting-started/',
  '/components/',
  '/playground/',
  ...componentSlugs.map((slug) => `/components/${slug}/`),
];

for (const theme of ['light', 'dark'] as const) {
  for (const route of PAGES) {
    test(`axe: ${route} (${theme})`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('docs-theme', t), theme);
      await page.goto(route);
      await expect(page.locator('main h1')).toBeVisible();
      await page.waitForLoadState('networkidle');
      const slug = route.match(/^\/components\/([^/]+)\/$/)?.[1];
      const known = slug ? KNOWN_AXE_ISSUES[slug] : undefined;
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .disableRules(known?.rules ?? [])
        .analyze();
      const violations = results.violations;
      expect(
        violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`),
      ).toEqual([]);
    });
  }
}

test('axe: code tab contrast on a pilot page', async ({ page, isMobile }) => {
  test.skip(isMobile, 'covered by desktop');
  await page.goto('/components/tabs/');
  await page.locator('docs-demo-viewer').first().getByRole('tab', { name: 'Code' }).click();
  const results = await new AxeBuilder({ page })
    .include('docs-code-block')
    .withTags(['wcag2aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
