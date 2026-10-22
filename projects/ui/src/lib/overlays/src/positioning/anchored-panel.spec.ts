import { describe, expect, it } from 'vitest';
import { positionPanel } from './anchored-panel';

const rect = (l: number, t: number, w: number, h: number) =>
  ({ left: l, top: t, width: w, height: h, right: l + w, bottom: t + h }) as DOMRect;

function panelOf(w: number, h: number): HTMLElement {
  const el = document.createElement('div');
  Object.defineProperty(el, 'offsetWidth', { value: w });
  Object.defineProperty(el, 'offsetHeight', { value: h });
  return el;
}

// jsdom viewport is 1024 x 768.
describe('positionPanel', () => {
  it('H-C-c098c2: bottom centres under the anchor (via computePosition)', () => {
    const el = panelOf(100, 50);
    positionPanel(el, rect(400, 100, 60, 20), 'bottom', { rtl: false });
    expect(el.style.top).toBe('128px');
    expect(el.style.left).toBe('380px');
  });

  it('H-C-c098c2: clamps to a 4px viewport margin', () => {
    const el = panelOf(200, 100);
    positionPanel(el, rect(980, 740, 40, 20), 'bottom', { rtl: false });
    expect(el.style.left).toBe('820px'); // 1024 - 200 - 4
    expect(el.style.top).toBe('664px'); // 768 - 100 - 4
  });

  it('H-C-c098c2: bottom-start / bottom-end flush with the logical edge, flipped in rtl', () => {
    const anchor = rect(400, 100, 60, 20);
    const a = panelOf(100, 50);
    positionPanel(a, anchor, 'bottom-start', { rtl: false });
    expect(a.style.left).toBe('400px');
    const b = panelOf(100, 50);
    positionPanel(b, anchor, 'bottom-end', { rtl: false });
    expect(b.style.left).toBe('360px'); // anchor.right - width
    const c = panelOf(100, 50);
    positionPanel(c, anchor, 'bottom-start', { rtl: true });
    expect(c.style.left).toBe('360px');
  });

  it('H-C-c098c2: right-start aligns the top edge; origin offsets to local coords', () => {
    const el = panelOf(100, 50);
    positionPanel(el, rect(400, 200, 60, 20), 'right-start', {
      rtl: false,
      origin: rect(400, 200, 60, 20),
    });
    expect(el.style.top).toBe('0px');
    expect(el.style.left).toBe('68px');
  });
});
