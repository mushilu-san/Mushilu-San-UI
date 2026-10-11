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
