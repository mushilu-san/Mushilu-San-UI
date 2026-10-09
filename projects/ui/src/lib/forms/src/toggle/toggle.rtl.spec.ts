import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Toggle } from './toggle';

describe('Toggle RTL CSS', () => {
  async function injectedCss(): Promise<string> {
    await renderTemplate('<div dir="rtl"><mui-toggle label="x"></mui-toggle></div>', {
      imports: [Toggle],
    });
    return Array.from(document.querySelectorAll('style'))
      .map((s) => s.textContent ?? '')
      .join('\n');
  }

  it('H-A-5dcd59: thumb uses logical offset, not physical left', async () => {
    const css = await injectedCss();
    expect(css).toContain('inset-inline-start: var(--thumb-offset)');
    expect(css).not.toMatch(/(^|[\s;{])left:\s*var\(--thumb-offset\)/);
  });

  it('H-A-5dcd59: checked translateX is scaled by --mui-dir-sign', async () => {
    const css = await injectedCss();
    expect(css).toContain('var(--mui-dir-sign, 1)');
  });
});
