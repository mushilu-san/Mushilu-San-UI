import { type ConsoleMessage, expect, test } from '@playwright/test';

const ROUTES = [
  '/',
  '/getting-started/',
  '/components/',
  '/components/group/navigation/',
  '/components/button/',
  '/components/dialog/',
  '/components/tabs/',
];

for (const route of ROUTES) {
  test(`${route} loads without console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg: ConsoleMessage) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto(route);
    await expect(page.locator('main h1')).toBeVisible();
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });
}

test('client navigation moves focus to the new h1', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop sidebar');
  await page.goto('/components/button/');
  await page.getByRole('complementary').getByRole('link', { name: 'Tabs' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Tabs' })).toBeFocused();
  await expect(page).toHaveTitle('Tabs · Mushilu-San UI');
});

test('theme toggle persists across reloads', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^Theme: system/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('button', { name: /^Theme: light/ })).toBeVisible();
});

test('copy button copies demo source', async ({ page, context, isMobile }) => {
  test.skip(isMobile, 'clipboard permissions are desktop-only in Playwright');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/components/button/');
  const hero = page.locator('docs-demo-viewer').first();
  await hero.getByRole('tab', { name: 'Code' }).click();
  await hero.getByRole('button', { name: 'Copy code' }).click();
  await expect(hero.getByRole('button', { name: 'Copied' })).toBeVisible();
  const text = await page.evaluate(() => navigator.clipboard.readText());
  expect(text).toContain('ButtonVariantsDemo');
});

test('dialog demo: focus moves in, Escape closes, focus returns', async ({ page }) => {
  await page.goto('/components/dialog/');
  const trigger = page.getByRole('button', { name: 'Edit profile' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Edit profile' });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(':focus')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('mobile nav sheet: opens, Escape closes, focus returns', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only');
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Open navigation' });
  await menu.click();
  const sheet = page.getByRole('dialog', { name: 'Navigation' });
  await expect(sheet).toBeVisible();
  await expect(sheet.locator(':focus')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(sheet).toBeHidden();
  await expect(menu).toBeFocused();
});

test('unknown URL falls back to client-rendered not-found', async ({ page }) => {
  const res = await page.goto('/does-not-exist/');
  expect(res?.status()).toBe(404);
});
