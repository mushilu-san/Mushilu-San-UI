import { test, expect, type Page } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiContextMenuHarness } from '../src/lib/overlays/src/testing/context-menu-harness';

test.describe('ContextMenu — E-5 right-click / Escape / keyboard', () => {
  test('right-click on trigger opens context menu', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'overlays-contextmenu--default');
    const menu = await loader.getHarness(MuiContextMenuHarness);
    await frame.getByText('Right-click here').click({ button: 'right', force: true });
    await expect(frame.getByRole('menu')).toBeVisible();
    await expect.poll(() => menu.isOpen()).toBe(true);
  });

  test('Escape closes context menu', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'overlays-contextmenu--default');
    const menu = await loader.getHarness(MuiContextMenuHarness);
    await frame.getByText('Right-click here').click({ button: 'right', force: true });
    await expect(frame.getByRole('menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(frame.getByRole('menu')).not.toBeVisible();
    await expect.poll(() => menu.isOpen()).toBe(false);
  });

  test('menu items have menuitem role', async ({ page }) => {
    const { frame } = await gotoStoryWithHarness(page, 'overlays-contextmenu--default');
    await frame.getByText('Right-click here').click({ button: 'right', force: true });
    await expect(frame.getByRole('menu')).toBeVisible();
    const items = frame.getByRole('menuitem');
    await expect(items).toHaveCount(4); // View, Edit, Duplicate, Delete
  });

  test('H-E-648d10: focus is inside the menu immediately after it opens', async ({ page }) => {
    const { frame } = await gotoStoryWithHarness(page, 'overlays-contextmenu--default');
    await frame.getByText('Right-click here').click({ button: 'right', force: true });
    await expect(frame.getByRole('menu')).toBeVisible();
    // Assert against document.activeElement directly rather than Playwright's
    // :focus-within/toBeFocused() locators: those read Chromium's window-level
    // "AX focused" state, which doesn't reliably propagate into a nested
    // Storybook iframe after an async afterNextRender() focus call triggered by
    // a right-click (no native focus-granting default action, unlike left-click).
    // document.activeElement is the actual DOM focus state assistive tech and
    // keyboard navigation rely on, and is what the fix in context-menu.ts sets.
    await expect
      .poll(() =>
        page.evaluate(() => {
          const iframe = document.getElementById(
            'storybook-preview-iframe',
          ) as HTMLIFrameElement | null;
          const active = iframe?.contentDocument?.activeElement;
          return active?.getAttribute('role') ?? null;
        }),
      )
      .toBe('menu');
  });

  test('Tab navigates to first menu item', async ({ page }) => {
    const { frame } = await gotoStoryWithHarness(page, 'overlays-contextmenu--default');
    await frame.getByText('Right-click here').click({ button: 'right', force: true });
    await expect(frame.getByRole('menu')).toBeVisible();
    await frame.getByRole('menuitem').first().focus();
    await expect(frame.getByRole('menuitem').first()).toBeFocused();
  });

  test('H-E-fd6a0a: focus returns to what was focused before the menu opened, after Escape', async ({
    page,
  }) => {
    const { frame } = await gotoStoryWithHarness(page, 'overlays-contextmenu--default');
    // ContextMenu's trigger area is a plain (non-focusable) div — the realistic
    // keyboard-user scenario is: focus lands elsewhere on the page, the menu is
    // opened (right-click), focus moves into it, and Escape must restore focus
    // to that prior element rather than stranding it on <body>.
    const priorFocus = frame.getByRole('button', { name: 'Focus me first' });
    await priorFocus.focus();
    await expect(priorFocus).toBeFocused();
    await frame.getByText('Right-click here').click({ button: 'right', force: true });
    await expect(frame.getByRole('menu')).toBeVisible();
    await frame.getByRole('menuitem').first().focus();
    await page.keyboard.press('Escape');
    await expect(frame.getByRole('menu')).not.toBeVisible();
    await expect(priorFocus).toBeFocused();
  });
});

test.describe('ContextMenu — H-E-9e07fc long-press (touch)', () => {
  test.use({ hasTouch: true });

  // Real touch input over CDP: Playwright's touchscreen API only taps, it cannot hold.
  // One CDP session per test — the browser tracks the active touch per session.
  async function setup(page: Page) {
    const { frame } = await gotoStoryWithHarness(page, 'overlays-contextmenu--default');
    const target = frame.getByText('Right-click here');
    await expect(target).toBeVisible();
    const box = await target.boundingBox();
    if (!box) throw new Error('trigger has no bounding box');
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    const cdp = await page.context().newCDPSession(page);
    const touch = (type: 'touchStart' | 'touchMove' | 'touchEnd', dx = 0, dy = 0) =>
      cdp.send('Input.dispatchTouchEvent', {
        type,
        touchPoints: type === 'touchEnd' ? [] : [{ x: x + dx, y: y + dy }],
      });
    return { frame, touch };
  }

  test('holding for 600ms opens the menu', async ({ page }) => {
    const { frame, touch } = await setup(page);
    await touch('touchStart');
    await expect(frame.getByRole('menu')).not.toBeVisible();
    await page.waitForTimeout(700);
    await expect(frame.getByRole('menu')).toBeVisible();
    await touch('touchEnd');
  });

  test('releasing before 600ms does not open the menu', async ({ page }) => {
    const { frame, touch } = await setup(page);
    await touch('touchStart');
    await page.waitForTimeout(250);
    await touch('touchEnd');
    await page.waitForTimeout(600);
    await expect(frame.getByRole('menu')).not.toBeVisible();
  });

  test('moving the finger cancels the long-press', async ({ page }) => {
    const { frame, touch } = await setup(page);
    await touch('touchStart');
    await touch('touchMove', 20, 20);
    await page.waitForTimeout(700);
    await expect(frame.getByRole('menu')).not.toBeVisible();
    await touch('touchEnd');
  });
});
