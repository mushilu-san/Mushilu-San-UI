import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const PAGES = [
  '/',
  '/getting-started/',
  '/components/button/',
  '/components/dialog/',
  '/components/tabs/',
];

for (const theme of ['light', 'dark'] as const) {
  for (const route of PAGES) {
    test(`axe: ${route} (${theme})`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('docs-theme', t), theme);
      await page.goto(route);
      await expect(page.locator('main h1')).toBeVisible();
      await page.waitForLoadState('networkidle');
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      // Library issue, not a docs one: dark-theme destructive Button is 3.76:1 (#707, A-8).
      // Only that rule on only that element is ignored; remove when A-8 is fixed in projects/ui.
      const violations = results.violations
        .map((v) => ({
          ...v,
          nodes: v.nodes.filter(
            (n) =>
              !(
                v.id === 'color-contrast' &&
                theme === 'dark' &&
                n.target.join(' ').startsWith('button[variant="destructive"]')
              ),
          ),
        }))
        .filter((v) => v.nodes.length > 0);
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
