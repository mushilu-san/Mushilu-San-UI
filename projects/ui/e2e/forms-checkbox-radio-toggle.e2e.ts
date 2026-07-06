import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiCheckboxHarness } from '../src/lib/forms/src/testing/checkbox-harness';
import { MuiRadioHarness } from '../src/lib/forms/src/testing/radio-harness';
import { MuiToggleHarness } from '../src/lib/forms/src/testing/toggle-harness';

test.describe('Checkbox — E2E', () => {
  test('renders as a native checkbox, unchecked and enabled by default', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-checkbox--default');
    const checkbox = await loader.getHarness(MuiCheckboxHarness);
    expect(await checkbox.isChecked()).toBe(false);
    expect(await checkbox.isDisabled()).toBe(false);
  });

  test('States story reflects checked and disabled combinations', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-checkbox--states');
    const checkboxes = await loader.getAllHarnesses(MuiCheckboxHarness);
    expect(checkboxes).toHaveLength(4);

    const [unchecked, checked, disabledUnchecked, disabledChecked] = checkboxes;
    expect(await unchecked.isChecked()).toBe(false);
    expect(await checked.isChecked()).toBe(true);
    expect(await disabledUnchecked.isDisabled()).toBe(true);
    expect(await disabledUnchecked.isChecked()).toBe(false);
    expect(await disabledChecked.isDisabled()).toBe(true);
    expect(await disabledChecked.isChecked()).toBe(true);
  });

  test('Invalid story sets data-invalid and aria-invalid', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'forms-checkbox--invalid');
    const checkbox = await loader.getHarness(MuiCheckboxHarness);
    expect(await checkbox.isInvalid()).toBe(true);
    await expect(frame.locator('input[type="checkbox"]')).toHaveAttribute('aria-invalid', 'true');
  });

  test('clicking toggles the checked state', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-checkbox--default');
    const checkbox = await loader.getHarness(MuiCheckboxHarness);
    expect(await checkbox.isChecked()).toBe(false);
    await checkbox.toggle();
    await expect.poll(() => checkbox.isChecked()).toBe(true);
    await checkbox.toggle();
    await expect.poll(() => checkbox.isChecked()).toBe(false);
  });

  test('Space toggles a focused checkbox', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-checkbox--default');
    const checkbox = await loader.getHarness(MuiCheckboxHarness);
    await checkbox.focus();
    await expect.poll(() => checkbox.isFocused()).toBe(true);
    await page.keyboard.press('Space');
    await expect.poll(() => checkbox.isChecked()).toBe(true);
  });
});

test.describe('Radio — E2E', () => {
  test('renders as a native radio, unchecked and enabled by default', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-radio--default');
    const radio = await loader.getHarness(MuiRadioHarness);
    expect(await radio.isChecked()).toBe(false);
    expect(await radio.isDisabled()).toBe(false);
  });

  test('Group story starts with the email option checked', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-radio--group');
    const email = await loader.getHarness(MuiRadioHarness.with({ value: 'email' }));
    const phone = await loader.getHarness(MuiRadioHarness.with({ value: 'phone' }));
    expect(await email.isChecked()).toBe(true);
    expect(await phone.isChecked()).toBe(false);
  });

  test('selecting one radio in a group unchecks the others', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-radio--group');
    const email = await loader.getHarness(MuiRadioHarness.with({ value: 'email' }));
    const sms = await loader.getHarness(MuiRadioHarness.with({ value: 'sms' }));

    await sms.select();
    await expect.poll(() => sms.isChecked()).toBe(true);
    await expect.poll(() => email.isChecked()).toBe(false);
  });

  test('Disabled story marks the pro plan radio as disabled', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-radio--disabled');
    const free = await loader.getHarness(MuiRadioHarness.with({ value: 'free' }));
    const pro = await loader.getHarness(MuiRadioHarness.with({ value: 'pro' }));
    expect(await free.isDisabled()).toBe(false);
    expect(await free.isChecked()).toBe(true);
    expect(await pro.isDisabled()).toBe(true);
  });

  test('Space selects a focused radio', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-radio--group');
    const phone = await loader.getHarness(MuiRadioHarness.with({ value: 'phone' }));
    await phone.focus();
    await expect.poll(() => phone.isFocused()).toBe(true);
    await page.keyboard.press('Space');
    await expect.poll(() => phone.isChecked()).toBe(true);
  });
});

test.describe('Toggle — E2E', () => {
  test('renders role="switch", unchecked and enabled by default', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-toggle--default');
    const toggle = await loader.getHarness(MuiToggleHarness);
    expect(await toggle.isChecked()).toBe(false);
    expect(await toggle.isDisabled()).toBe(false);
  });

  test('WithLabel story exposes the label via aria-label', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-toggle--with-label');
    const toggle = await loader.getHarness(MuiToggleHarness);
    expect(await toggle.getLabel()).toBe('Dark mode');
  });

  test('States story reflects on/off and disabled combinations', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-toggle--states');
    const toggles = await loader.getAllHarnesses(MuiToggleHarness);
    expect(toggles).toHaveLength(4);

    const [off, on, disabledOff, disabledOn] = toggles;
    expect(await off.isChecked()).toBe(false);
    expect(await on.isChecked()).toBe(true);
    expect(await disabledOff.isDisabled()).toBe(true);
    expect(await disabledOff.isChecked()).toBe(false);
    expect(await disabledOn.isDisabled()).toBe(true);
    expect(await disabledOn.isChecked()).toBe(true);
  });

  test('clicking toggles the checked state', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-toggle--default');
    const toggle = await loader.getHarness(MuiToggleHarness);
    expect(await toggle.isChecked()).toBe(false);
    await toggle.toggle();
    await expect.poll(() => toggle.isChecked()).toBe(true);
    await toggle.toggle();
    await expect.poll(() => toggle.isChecked()).toBe(false);
  });

  test('Space toggles a focused switch', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-toggle--default');
    const toggle = await loader.getHarness(MuiToggleHarness);
    await toggle.focus();
    await expect.poll(() => toggle.isFocused()).toBe(true);
    await page.keyboard.press('Space');
    await expect.poll(() => toggle.isChecked()).toBe(true);
  });

  test('a disabled switch is not operable via click', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'forms-toggle--states');
    const toggle = (await loader.getAllHarnesses(MuiToggleHarness))[2]; // Disabled off
    expect(await toggle.isDisabled()).toBe(true);
    await expect(frame.locator('mui-toggle').nth(2)).toHaveAttribute('tabindex', '-1');
  });
});
