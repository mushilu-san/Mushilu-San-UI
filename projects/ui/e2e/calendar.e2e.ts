import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';

test.describe('Calendar — E-7 keyboard navigation & selection', () => {
  test('renders a date grid', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-calendar--default');
    await expect(frame.getByRole('grid')).toBeVisible();
  });

  test('ArrowRight moves focus to next day', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-calendar--with-selected-date');
    // Focus the active (tabindex=0) day button and press ArrowRight
    const activeDay = frame.locator('button.cal-day[tabindex="0"]');
    await activeDay.focus();
    const initialLabel = await activeDay.getAttribute('aria-label');
    await page.keyboard.press('ArrowRight');
    // After ArrowRight a new button has tabindex=0 with a different label
    const nextDay = frame.locator('button.cal-day[tabindex="0"]');
    await expect(nextDay).not.toHaveAttribute('aria-label', initialLabel ?? '');
  });

  test('ArrowDown moves focus down one week', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-calendar--with-selected-date');
    const activeDay = frame.locator('button.cal-day[tabindex="0"]');
    await activeDay.focus();
    const initialLabel = await activeDay.getAttribute('aria-label');
    await page.keyboard.press('ArrowDown');
    const nextDay = frame.locator('button.cal-day[tabindex="0"]');
    await expect(nextDay).not.toHaveAttribute('aria-label', initialLabel ?? '');
  });

  test('clicking Next Month advances the heading', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-calendar--default');
    const heading = frame.getByRole('heading');
    const initial = await heading.textContent();
    await frame.getByRole('button', { name: /next month/i }).click();
    await expect(heading).not.toHaveText(initial ?? '');
  });

  test('clicking Previous Month goes back', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-calendar--default');
    const heading = frame.getByRole('heading');
    const initial = await heading.textContent();
    await frame.getByRole('button', { name: /next month/i }).click();
    await expect(heading).not.toHaveText(initial ?? ''); // wait for Next to render
    await frame.getByRole('button', { name: /previous month/i }).click();
    await expect(heading).toHaveText(initial ?? ''); // back to starting month
  });

  test('clicking a day marks it aria-selected="true"', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-calendar--default');
    const days = frame.locator('button.cal-day:not([data-outside])');
    await days.nth(14).click(); // 0-indexed → day 15
    await expect(days.nth(14)).toHaveAttribute('aria-selected', 'true');
  });

  test('min/max story disables out-of-range days', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-calendar--with-min-max-date');
    // At least one day should be aria-disabled
    await expect(frame.locator('button.cal-day[aria-disabled]').first()).toBeVisible();
  });

  test('PageDown navigates to next month', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-calendar--default');
    const heading = frame.getByRole('heading');
    const initial = await heading.textContent();
    const activeDay = frame.locator('button.cal-day[tabindex="0"]');
    await activeDay.focus();
    await page.keyboard.press('PageDown');
    await expect(heading).not.toHaveText(initial ?? '');
  });
});
