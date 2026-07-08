import { describe, it, expect } from 'vitest';
import { computeNextVersion, isoWeekYearAndWeek } from './calver-version.mjs';

describe('isoWeekYearAndWeek', () => {
  it('computes ISO week for a mid-year date', () => {
    expect(isoWeekYearAndWeek(new Date(Date.UTC(2026, 6, 8)))).toEqual({ year: 2026, week: 28 });
  });

  it('rolls late-December dates into week 1 of the next ISO year', () => {
    expect(isoWeekYearAndWeek(new Date(Date.UTC(2025, 11, 29)))).toEqual({ year: 2026, week: 1 });
  });
});

describe('computeNextVersion', () => {
  it('starts a new week at counter 1 when no tags exist for that week', () => {
    expect(computeNextVersion([], new Date(Date.UTC(2026, 6, 8)))).toBe('2026.28.1');
  });

  it('increments the counter for an existing week', () => {
    const tags = ['v2026.28.1', 'v2026.28.2', 'v2026.27.5'];
    expect(computeNextVersion(tags, new Date(Date.UTC(2026, 6, 8)))).toBe('2026.28.3');
  });

  it('ignores unrelated tag names', () => {
    const tags = ['some-other-tag', 'v2026.28.1'];
    expect(computeNextVersion(tags, new Date(Date.UTC(2026, 6, 8)))).toBe('2026.28.2');
  });

  it('is robust to a gap left by a deleted tag (uses max, not count)', () => {
    const tags = ['v2026.28.1', 'v2026.28.3'];
    expect(computeNextVersion(tags, new Date(Date.UTC(2026, 6, 8)))).toBe('2026.28.4');
  });
});
