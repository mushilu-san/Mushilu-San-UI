import { test, expect } from '@playwright/test';
import { gotoStoryWithHarness } from './helpers/harness';
import { MuiAvatarHarness } from '../src/lib/primitives/src/testing/avatar-harness';

test.describe('Avatar — E2E structure', () => {
  test('default avatar has role=img, aria-label, and initials fallback', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'primitives-avatar--default');
    const avatar = await loader.getHarness(MuiAvatarHarness);
    expect(await avatar.getLabel()).toBe('Jane Doe');
    expect(await avatar.isShowingFallback()).toBe(true);
    expect(await avatar.isShowingImage()).toBe(false);
    expect(await avatar.getInitialsText()).toBe('JD');
  });

  test('avatar with a src renders the image element instead of the fallback', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'primitives-avatar--with-image');
    const avatar = await loader.getHarness(MuiAvatarHarness);
    expect(await avatar.isShowingImage()).toBe(true);
    expect(await avatar.isShowingFallback()).toBe(false);
  });

  test('fallback initials are derived per-avatar, "?" when no name is given', async ({ page }) => {
    const { loader } = await gotoStoryWithHarness(page, 'primitives-avatar--fallback-initials');
    const avatars = await loader.getAllHarnesses(MuiAvatarHarness);
    expect(await Promise.all(avatars.map((a) => a.getInitialsText()))).toEqual([
      'A',
      'BS',
      'CX',
      '?',
    ]);
  });
});
