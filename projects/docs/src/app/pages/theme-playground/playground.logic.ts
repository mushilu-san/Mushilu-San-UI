/** A colour token the playground can change. Values are the light-theme defaults in hex. */
export interface ThemeToken {
  readonly name: string;
  readonly label: string;
  readonly value: string;
}

export const THEME_TOKENS: readonly ThemeToken[] = [
  { name: '--mui-color-primary', label: 'Primary', value: '#2563eb' },
  { name: '--mui-color-primary-text', label: 'Text on primary', value: '#ffffff' },
  { name: '--mui-color-surface', label: 'Surface', value: '#f8fafc' },
  { name: '--mui-color-surface-raised', label: 'Raised surface', value: '#ffffff' },
  { name: '--mui-color-text', label: 'Text', value: '#0f172a' },
  { name: '--mui-color-text-muted', label: 'Muted text', value: '#64748b' },
  { name: '--mui-color-border', label: 'Border', value: '#e2e8f0' },
  { name: '--mui-color-danger', label: 'Danger', value: '#dc2626' },
  { name: '--mui-color-success', label: 'Success', value: '#16a34a' },
  { name: '--mui-color-warning', label: 'Warning', value: '#d97706' },
];

export interface ContrastPair {
  readonly label: string;
  /** Token used for the foreground (text, or the stroke for a boundary). */
  readonly fg: string;
  readonly bg: string;
  /** WCAG AA minimum: 4.5 for text, 3 for UI boundaries and focus indicators. */
  readonly min: number;
}

export const CONTRAST_PAIRS: readonly ContrastPair[] = [
  { label: 'Text on surface', fg: '--mui-color-text', bg: '--mui-color-surface', min: 4.5 },
  {
    label: 'Muted text on surface',
    fg: '--mui-color-text-muted',
    bg: '--mui-color-surface',
    min: 4.5,
  },
  { label: 'Text on primary', fg: '--mui-color-primary-text', bg: '--mui-color-primary', min: 4.5 },
  { label: 'Primary as link text', fg: '--mui-color-primary', bg: '--mui-color-surface', min: 4.5 },
  { label: 'Danger text', fg: '--mui-color-danger', bg: '--mui-color-surface', min: 4.5 },
  { label: 'Success text', fg: '--mui-color-success', bg: '--mui-color-surface', min: 4.5 },
  { label: 'Border boundary', fg: '--mui-color-border', bg: '--mui-color-surface', min: 3 },
];

const HEX = /^#([0-9a-f]{6})$/i;

/** Relative luminance of a `#rrggbb` colour, per WCAG 2.x. Returns `null` for other formats. */
export function luminance(hex: string): number | null {
  const m = HEX.exec(hex);
  if (!m) return null;
  const channels = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio between two `#rrggbb` colours, from 1 to 21. `null` if either is not hex. */
export function contrastRatio(a: string, b: string): number | null {
  const la = luminance(a);
  const lb = luminance(b);
  if (la === null || lb === null) return null;
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Only the tokens that differ from the default are exported, so the CSS stays small. */
export function changedTokens(
  values: Readonly<Record<string, string>>,
  tokens: readonly ThemeToken[] = THEME_TOKENS,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const t of tokens) {
    const v = values[t.name];
    if (v && v.toLowerCase() !== t.value.toLowerCase()) out[t.name] = v.toLowerCase();
  }
  return out;
}

/** CSS that applies the changed tokens to `:root`. */
export function buildCss(changed: Readonly<Record<string, string>>): string {
  const lines = Object.entries(changed).map(([name, value]) => `  ${name}: ${value};`);
  if (lines.length === 0) return '/* No changes from the default theme. */';
  return [':root {', ...lines, '}'].join('\n');
}

/** Inline style string that scopes every token to the preview, so only the preview changes. */
export function scopeStyle(values: Readonly<Record<string, string>>): string {
  return Object.entries(values)
    .map(([name, value]) => `${name}: ${value}`)
    .join('; ');
}
