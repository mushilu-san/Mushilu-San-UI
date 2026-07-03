import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiIconHarness } from '../src/lib/primitives/src/testing/icon-harness';

test.describe('Icon — E2E aria contract', () => {
  test('default icon has no label and is aria-hidden (decorative)', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'primitives-icon--default');
    const icon = await loader.getHarness(MuiIconHarness);
    expect(await icon.getName()).toBe('check');
    expect(await icon.isDecorative()).toBe(true);
    expect(await icon.getRole()).toBe(null);
  });

  test('labelled icon gets role=img and aria-label, decorative icon stays hidden', async ({
    page,
  }) => {
    const { loader } = await gotoStoryWithHarness(page, 'primitives-icon--accessibility');
    const icons = await loader.getAllHarnesses(MuiIconHarness);

    const decorative = icons[0];
    expect(await decorative.isDecorative()).toBe(true);
    expect(await decorative.getRole()).toBe(null);

    const labelled = icons[1];
    expect(await labelled.getLabel()).toBe('Success');
    expect(await labelled.getRole()).toBe('img');
    expect(await labelled.isDecorative()).toBe(false);
  });
});
