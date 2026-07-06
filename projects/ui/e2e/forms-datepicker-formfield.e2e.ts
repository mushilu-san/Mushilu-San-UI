import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiDatePickerHarness } from '../src/lib/forms/src/testing/date-picker-harness';
import { MuiFormFieldHarness } from '../src/lib/forms/src/testing/form-field-harness';

test.describe('DatePicker — E-234 trigger, open/close, disabled state', () => {
  test('renders a trigger button with the placeholder text', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'forms-datepicker--default');
    const picker = await loader.getHarness(MuiDatePickerHarness);
    await expect(frame.locator('.dp-trigger')).toBeVisible();
    expect(await picker.getDisplayedValue()).toBe('Pick a date');
  });

  test('clicking the trigger opens the calendar panel', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'forms-datepicker--default');
    const picker = await loader.getHarness(MuiDatePickerHarness);
    expect(await picker.isOpen()).toBe(false);
    await picker.open();
    await expect.poll(() => picker.isOpen()).toBe(true);
    await expect(frame.locator('[role="dialog"]')).toBeVisible();
  });

  test('Escape closes the open panel', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-datepicker--default');
    const picker = await loader.getHarness(MuiDatePickerHarness);
    await picker.open();
    await expect.poll(() => picker.isOpen()).toBe(true);
    await picker.close();
    await expect.poll(() => picker.isOpen()).toBe(false);
  });

  test('selecting a day updates the displayed value and closes the panel', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-datepicker--default');
    const picker = await loader.getHarness(MuiDatePickerHarness);
    const before = await picker.getDisplayedValue();
    await picker.open();
    await expect.poll(() => picker.isOpen()).toBe(true);
    await picker.selectFirstAvailableDay();
    await expect.poll(() => picker.isOpen()).toBe(false);
    await expect.poll(() => picker.getDisplayedValue()).not.toBe(before);
  });

  test('disabled story renders a trigger that is aria-disabled and does not open', async ({
    page,
  }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'forms-datepicker--disabled');
    const picker = await loader.getHarness(MuiDatePickerHarness);
    expect(await picker.isDisabled()).toBe(true);
    // The trigger has `pointer-events: none` while disabled, so a normal Playwright click
    // never resolves as actionable (it just retries until timeout). Force-dispatch the click
    // to verify the component's own `toggle()` guard rejects it, rather than relying on CSS
    // to block the interaction.
    await frame.locator('.dp-trigger').click({ force: true });
    expect(await picker.isOpen()).toBe(false);
  });
});

test.describe('FormField — E-234 label/hint/error association', () => {
  test('default story renders a label wired to the projected control via for/id', async ({
    page,
  }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'forms-formfield--default');
    const field = await loader.getHarness(MuiFormFieldHarness);
    expect(await field.getLabelText()).toBe('Email address');
    const label = frame.locator('.field-label');
    const forAttr = await label.getAttribute('for');
    expect(forAttr).toBe('email1');
    await expect(frame.locator(`#${forAttr}`)).toBeVisible();
  });

  test('with-hint story shows hint text and no error', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-formfield--with-hint');
    const field = await loader.getHarness(MuiFormFieldHarness);
    expect(await field.hasHint()).toBe(true);
    expect(await field.getHintText()).toBe('Letters and numbers only, 3-20 characters.');
    expect(await field.hasError()).toBe(false);
  });

  test('with-error story shows error text with role=alert and marks the host invalid', async ({
    page,
  }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'forms-formfield--with-error');
    const field = await loader.getHarness(MuiFormFieldHarness);
    expect(await field.hasError()).toBe(true);
    expect(await field.getErrorText()).toBe('Please enter a valid email address.');
    expect(await field.isInvalid()).toBe(true);
    await expect(frame.locator('.field-error')).toHaveAttribute('role', 'alert');
  });

  test('required story renders the required asterisk mark', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-formfield--required');
    const field = await loader.getHarness(MuiFormFieldHarness);
    expect(await field.isRequired()).toBe(true);
  });

  test('renders projected control content inside the field', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-formfield--default');
    await expect(frame.locator('.field-control input')).toBeVisible();
  });
});
