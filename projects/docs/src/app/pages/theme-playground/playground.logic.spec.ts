import {
  THEME_TOKENS,
  buildCss,
  changedTokens,
  contrastRatio,
  luminance,
  scopeStyle,
} from './playground.logic';

describe('theme playground logic', () => {
  it('computes black on white as 21:1', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
  });

  it('is symmetric in its arguments', () => {
    expect(contrastRatio('#2563eb', '#ffffff')).toBeCloseTo(
      contrastRatio('#ffffff', '#2563eb')!,
      10,
    );
  });

  it('returns 1 for identical colours', () => {
    expect(contrastRatio('#64748b', '#64748b')).toBeCloseTo(1, 10);
  });

  it('returns null for values that are not #rrggbb', () => {
    expect(luminance('rgb(0, 0, 0)')).toBeNull();
    expect(contrastRatio('#fff', '#000000')).toBeNull();
  });

  it('exports only tokens that differ from the default', () => {
    const values = Object.fromEntries(THEME_TOKENS.map((t) => [t.name, t.value]));
    values['--mui-color-primary'] = '#7c3aed';
    expect(changedTokens(values)).toEqual({ '--mui-color-primary': '#7c3aed' });
  });

  it('treats default values in other letter case as unchanged', () => {
    expect(changedTokens({ '--mui-color-primary': '#2563EB' })).toEqual({});
  });

  it('builds a :root block for the changed tokens', () => {
    expect(buildCss({ '--mui-color-primary': '#7c3aed' })).toBe(
      ':root {\n  --mui-color-primary: #7c3aed;\n}',
    );
  });

  it('says so when nothing changed', () => {
    expect(buildCss({})).toBe('/* No changes from the default theme. */');
  });

  it('builds an inline style string for the preview scope', () => {
    expect(scopeStyle({ '--mui-color-primary': '#7c3aed', '--mui-color-text': '#111111' })).toBe(
      '--mui-color-primary: #7c3aed; --mui-color-text: #111111',
    );
  });
});
