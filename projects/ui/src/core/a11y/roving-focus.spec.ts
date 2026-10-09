import { afterEach, describe, expect, it } from 'vitest';
import { handleRovingFocus } from './roving-focus';
import type { RovingFocusConfig } from './roving-focus';

afterEach(() => {
  document.body.replaceChildren();
});

function setup(n = 3): HTMLElement[] {
  const items = Array.from({ length: n }, () => document.createElement('button'));
  items.forEach((b) => document.body.appendChild(b));
  return items;
}
function press(items: HTMLElement[], from: number, key: string, cfg?: RovingFocusConfig) {
  items[from].focus();
  const ev = new KeyboardEvent('keydown', { key, cancelable: true });
  const handled = handleRovingFocus(ev, items, document.activeElement, cfg);
  return { handled, idx: items.indexOf(document.activeElement as HTMLElement) };
}

describe('handleRovingFocus', () => {
  it('H-B-61716a: horizontal ltr: ArrowRight next, ArrowLeft prev', () => {
    const items = setup();
    expect(press(items, 0, 'ArrowRight', { orientation: 'horizontal' }).idx).toBe(1);
    expect(press(items, 1, 'ArrowLeft', { orientation: 'horizontal' }).idx).toBe(0);
  });

  it('H-B-61716a: horizontal rtl: ArrowRight prev, ArrowLeft next', () => {
    const items = setup();
    const cfg: RovingFocusConfig = { orientation: 'horizontal', rtl: true };
    expect(press(items, 1, 'ArrowRight', cfg).idx).toBe(0);
    expect(press(items, 0, 'ArrowLeft', cfg).idx).toBe(1);
  });

  it('H-B-61716a: both rtl swaps horizontal keys, vertical keys unchanged', () => {
    const items = setup();
    const cfg: RovingFocusConfig = { orientation: 'both', rtl: true };
    expect(press(items, 1, 'ArrowRight', cfg).idx).toBe(0);
    expect(press(items, 0, 'ArrowLeft', cfg).idx).toBe(1);
    expect(press(items, 0, 'ArrowDown', cfg).idx).toBe(1);
    expect(press(items, 1, 'ArrowUp', cfg).idx).toBe(0);
  });

  it('vertical ignores horizontal keys regardless of rtl', () => {
    const items = setup();
    expect(press(items, 0, 'ArrowRight', { rtl: true }).handled).toBe(false);
    expect(press(items, 0, 'ArrowLeft', { rtl: true }).handled).toBe(false);
    expect(press(items, 0, 'ArrowDown', { rtl: true }).idx).toBe(1);
  });

  it('wraps by default, not when wrap=false', () => {
    const items = setup();
    expect(press(items, 2, 'ArrowDown').idx).toBe(0);
    expect(press(items, 0, 'ArrowUp').idx).toBe(2);
    expect(press(items, 2, 'ArrowDown', { wrap: false }).idx).toBe(2);
    expect(press(items, 0, 'ArrowUp', { wrap: false }).idx).toBe(0);
  });

  it('Home/End jump to first/last in both directions', () => {
    const items = setup();
    for (const rtl of [false, true]) {
      expect(press(items, 1, 'Home', { orientation: 'horizontal', rtl }).idx).toBe(0);
      expect(press(items, 1, 'End', { orientation: 'horizontal', rtl }).idx).toBe(2);
    }
  });

  it('returns false for empty items and unrelated keys', () => {
    const ev = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    expect(handleRovingFocus(ev, [], null)).toBe(false);
    const items = setup();
    expect(press(items, 0, 'a').handled).toBe(false);
  });
});
