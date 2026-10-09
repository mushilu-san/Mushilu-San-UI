import { describe, expect, it } from 'vitest';
import { computePosition } from './compute-position';

const rect = (l: number, t: number, w: number, h: number) =>
  ({ left: l, top: t, width: w, height: h, right: l + w, bottom: t + h }) as DOMRect;

describe('computePosition', () => {
  const anchor = rect(400, 300, 100, 40);

  it('physical placements are unchanged and report resolvedPlacement', () => {
    const r = computePosition(anchor, 50, 20, 'right', 8);
    expect(r).toEqual({ top: 310, left: 508, resolvedPlacement: 'right' });
    expect(computePosition(anchor, 50, 20, 'left', 8).left).toBe(342);
    expect(computePosition(anchor, 50, 20, 'bottom', 8).top).toBe(348);
    expect(computePosition(anchor, 50, 20, 'top', 8).resolvedPlacement).toBe('top');
  });

  it('H-B-61716a: start/end resolve to left/right in ltr (default)', () => {
    expect(computePosition(anchor, 50, 20, 'start').resolvedPlacement).toBe('left');
    expect(computePosition(anchor, 50, 20, 'end').resolvedPlacement).toBe('right');
  });

  it('H-B-61716a: start/end flip in rtl', () => {
    const start = computePosition(anchor, 50, 20, 'start', 8, 4, { rtl: true });
    const end = computePosition(anchor, 50, 20, 'end', 8, 4, { rtl: true });
    expect(start.resolvedPlacement).toBe('right');
    expect(start.left).toBe(508);
    expect(end.resolvedPlacement).toBe('left');
    expect(end.left).toBe(342);
  });

  it('rtl does not affect physical placements', () => {
    expect(computePosition(anchor, 50, 20, 'left', 8, 4, { rtl: true }).resolvedPlacement).toBe(
      'left',
    );
  });

  it('clamps within viewport margin', () => {
    const r = computePosition(rect(0, 0, 10, 10), 50, 20, 'left', 8, 4);
    expect(r.left).toBe(4);
    expect(r.top).toBeGreaterThanOrEqual(4);
  });
});
