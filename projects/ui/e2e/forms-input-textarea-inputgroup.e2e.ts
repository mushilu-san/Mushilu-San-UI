import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiInputHarness } from '../src/lib/forms/src/testing/input-harness';
import { MuiTextareaHarness } from '../src/lib/forms/src/testing/textarea-harness';
import { MuiInputGroupHarness } from '../src/lib/forms/src/testing/input-group-harness';

// E-11 (remainder): Input, Textarea, InputGroup — E2E coverage via CDK harnesses.

test.describe('Input — E2E', () => {
  test('renders with default size and no invalid state', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-input--default');
    const input = await loader.getHarness(MuiInputHarness);
    expect(await input.getSize()).toBe('md');
    expect(await input.isInvalid()).toBe(false);
    expect(await input.isDisabled()).toBe(false);
  });

  test('typing a value is reflected back through the harness', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-input--default');
    const input = await loader.getHarness(MuiInputHarness);
    await input.setValue('hello world');
    await expect.poll(() => input.getValue()).toBe('hello world');
  });

  test('disabled story input rejects focus and reports disabled', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-input--disabled');
    const input = await loader.getHarness(MuiInputHarness);
    expect(await input.isDisabled()).toBe(true);
    await input.focus();
    expect(await input.isFocused()).toBe(false);
  });

  test('invalid story input exposes data-invalid state', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-input--invalid');
    const input = await loader.getHarness(MuiInputHarness);
    expect(await input.isInvalid()).toBe(true);
  });
});

test.describe('Textarea — E2E', () => {
  test('renders with default resize mode and no invalid state', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-textarea--default');
    const textarea = await loader.getHarness(MuiTextareaHarness);
    expect(await textarea.getResize()).toBe('vertical');
    expect(await textarea.isInvalid()).toBe(false);
  });

  test('typing a value is reflected back through the harness', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-textarea--default');
    const textarea = await loader.getHarness(MuiTextareaHarness);
    await textarea.setValue('a multi-line\nmessage body');
    await expect.poll(() => textarea.getValue()).toBe('a multi-line\nmessage body');
  });

  test('disabled story textarea rejects focus and reports disabled', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-textarea--disabled');
    const textarea = await loader.getHarness(MuiTextareaHarness);
    expect(await textarea.isDisabled()).toBe(true);
    await textarea.focus();
    expect(await textarea.isFocused()).toBe(false);
  });

  test('invalid story textarea exposes data-invalid state', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-textarea--invalid');
    const textarea = await loader.getHarness(MuiTextareaHarness);
    expect(await textarea.isInvalid()).toBe(true);
  });
});

test.describe('InputGroup — E2E', () => {
  test('default group has no addons and a plain nested input', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-inputgroup--default');
    const group = await loader.getHarness(MuiInputGroupHarness);
    expect(await group.getAddonCount()).toBe(0);
    expect(await group.getSize()).toBe('md');
    const input = await group.getInput();
    await input.setValue('grouped value');
    await expect.poll(() => input.getValue()).toBe('grouped value');
  });

  test('leading addon renders before the input with correct text', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-inputgroup--with-leading-addon');
    const group = await loader.getHarness(MuiInputGroupHarness);
    expect(await group.getAddonTexts()).toEqual(['$']);
  });

  test('trailing addon renders with correct text', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-inputgroup--with-trailing-addon');
    const group = await loader.getHarness(MuiInputGroupHarness);
    expect(await group.getAddonTexts()).toEqual(['@example.com']);
  });

  test('both-addons story exposes leading and trailing addon text in DOM order', async ({
    page,
  }) => {
    const { loader } = await gotoStoryWithHarness(page, 'forms-inputgroup--both-addons');
    const [group] = await loader.getAllHarnesses(MuiInputGroupHarness);
    expect(group).toBeDefined();
    expect(await group?.getAddonTexts()).toEqual(['$', 'USD']);
  });

  test('invalid group propagates invalid state to its own host and the nested input', async ({
    page,
  }) => {
    const { frame, loader } = await gotoStoryWithHarness(page, 'forms-inputgroup--invalid');
    const group = await loader.getHarness(MuiInputGroupHarness);
    expect(await group.isInvalid()).toBe(true);
    await expect(frame.locator('input')).toHaveAttribute('aria-invalid', 'true');
    await expect(frame.locator('input')).toHaveAttribute('data-invalid', 'true');
  });
});
