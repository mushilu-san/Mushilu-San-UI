import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiSpinnerHarness } from '../src/lib/primitives/src/testing/spinner-harness';

test.describe('Spinner — E2E aria contract', () => {
  test('default spinner is role=status with the default "Loading" label', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'primitives-spinner--default');
    const spinner = await loader.getHarness(MuiSpinnerHarness);
    expect(await spinner.getRole()).toBe('status');
    expect(await spinner.getLabel()).toBe('Loading');
  });

  test('custom label overrides the default announcement', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'primitives-spinner--accessibility');
    const spinners = await loader.getAllHarnesses(MuiSpinnerHarness);
    expect(await spinners[0].getLabel()).toBe('Loading');
    expect(await spinners[1].getLabel()).toBe('Uploading file, please wait');
  });
});
