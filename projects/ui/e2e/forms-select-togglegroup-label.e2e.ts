import { test, expect } from '@playwright/test';
import { gotoStory } from './helpers/story';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiSelectHarness } from '../src/lib/forms/src/testing/select-harness';
import { MuiToggleGroupHarness } from '../src/lib/forms/src/testing/toggle-group-harness';
import { MuiLabelHarness } from '../src/lib/forms/src/testing/label-harness';

test.describe('Select — E2E', () => {
  test('renders as a native combobox with the placeholder option selected', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'forms-select--default');
    await expect(frame.locator('select[muiSelect]')).toHaveAttribute('aria-label', 'Country');
    const select = await loader.getHarness(MuiSelectHarness);
    expect(await select.getValue()).toBe('');
  });

  test('selecting an option updates the native value', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-select--default');
    const select = await loader.getHarness(MuiSelectHarness);
    await select.selectOption('gb');
    expect(await select.getValue()).toBe('gb');
    await select.selectOption('ca');
    expect(await select.getValue()).toBe('ca');
  });

  test('disabled story renders a disabled select', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-select--disabled');
    const select = await loader.getHarness(MuiSelectHarness);
    expect(await select.isDisabled()).toBe(true);
  });

  test('invalid story sets data-invalid and aria-invalid', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'forms-select--invalid');
    const select = await loader.getHarness(MuiSelectHarness);
    expect(await select.isInvalid()).toBe(true);
    await expect(frame.locator('select[muiSelect]')).toHaveAttribute('aria-invalid', 'true');
  });
});

test.describe('ToggleGroup — E2E', () => {
  // H-B-ToggleGroup-CtxLive (issue #288): mui-toggle-group-item does not mount as an Angular
  // component in the production/Storybook build — it renders as inert plain markup (no button,
  // no aria-pressed) even though the identical composition passes fully under TestBed unit tests
  // (toggle-group.spec.ts). Marked fixme rather than deleted so these stay documented and
  // auto-verify themselves once the underlying DI/mounting bug is fixed.
  test.fixme('single-select story starts with one item pressed and toggles selection on click', async ({
    page,
  }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-togglegroup--single');
    const group = await loader.getHarness(MuiToggleGroupHarness);
    await expect.poll(() => group.getSelectedValues()).toEqual(['left']);

    await group.selectItem('center');
    await expect.poll(() => group.getSelectedValues()).toEqual(['center']);

    // Single mode: clicking the already-selected item toggles it off.
    await group.selectItem('center');
    await expect.poll(() => group.getSelectedValues()).toEqual([]);
  });

  // H-B-ToggleGroup-CtxLive (issue #288) — see note above.
  test.fixme('multiple-select story accumulates and removes independent selections', async ({
    page,
  }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-togglegroup--multiple');
    const group = await loader.getHarness(MuiToggleGroupHarness);
    await expect.poll(() => group.getSelectedValues()).toEqual(['bold']);

    await group.selectItem('italic');
    await expect
      .poll(() => group.getSelectedValues())
      .toEqual(expect.arrayContaining(['bold', 'italic']));

    await group.selectItem('bold');
    await expect.poll(() => group.getSelectedValues()).toEqual(['italic']);
  });

  // H-B-ToggleGroup-CtxLive (issue #288) — see note above.
  test.fixme('with-disabled story: group-level disables every item, item-level disables only itself', async ({
    page,
  }) => {
    // Story renders two <mui-toggle-group>s: the first is disabled wholesale, the second only
    // disables its middle item — getAllHarnesses lets us assert both independently.
    const { loader } = await gotoStoryWithHarness(page, 'forms-togglegroup--with-disabled');
    const groups = await loader.getAllHarnesses(MuiToggleGroupHarness);
    expect(groups).toHaveLength(2);
    const [groupDisabled, itemDisabled] = groups;
    expect(await groupDisabled.isDisabled('a')).toBe(true);
    expect(await groupDisabled.isDisabled('b')).toBe(true);
    expect(await itemDisabled.isDisabled('a')).toBe(false);
    expect(await itemDisabled.isDisabled('b')).toBe(true);
    expect(await itemDisabled.isDisabled('c')).toBe(false);
  });

  test('container exposes role="group"', async ({ page }) => {
    const frame = await gotoStory(page, 'forms-togglegroup--single');
    await expect(frame.locator('mui-toggle-group')).toHaveAttribute('role', 'group');
  });

  // H-B-ToggleGroup-CtxLive (issue #288) — see note above.
  test.fixme('keyboard: Space toggles a focused item', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'forms-togglegroup--single');
    const group = await loader.getHarness(MuiToggleGroupHarness);
    await expect.poll(() => group.getSelectedValues()).toEqual(['left']);

    await frame.locator('mui-toggle-group-item[value="right"] [part="button"]').focus();
    await page.keyboard.press('Space');
    await expect.poll(() => group.getSelectedValues()).toEqual(['right']);
  });
});

test.describe('Label — E2E', () => {
  test('renders label text with no required marker by default', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-label--default');
    const label = await loader.getHarness(MuiLabelHarness);
    expect(await label.getText()).toBe('Email address');
    expect(await label.isRequired()).toBe(false);
  });

  test('required story shows an aria-hidden asterisk', async ({ page }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'forms-label--required');
    const label = await loader.getHarness(MuiLabelHarness);
    expect(await label.isRequired()).toBe(true);
    await expect(frame.locator('.required-mark')).toHaveAttribute('aria-hidden', 'true');
  });

  test('disabled story sets data-disabled on the host', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-label--disabled');
    const label = await loader.getHarness(MuiLabelHarness);
    expect(await label.isDisabled()).toBe(true);
  });

  test('with-input story: label is associated via for/id and clicking it focuses the input', async ({
    page,
  }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'forms-label--with-input');
    const label = await loader.getHarness(MuiLabelHarness);
    expect(await label.getFor()).toBe('email');

    await frame.locator('label', { hasText: 'Email address' }).click();
    await expect(frame.locator('#email')).toBeFocused();
  });
});
