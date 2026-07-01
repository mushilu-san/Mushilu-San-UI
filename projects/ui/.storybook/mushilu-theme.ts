import { create } from 'storybook/theming/create';

export const mushiluTheme = create({
  base: 'light',

  brandTitle: 'Mushilu-San UI',
  brandUrl: 'https://github.com/Mushilu-San/ui',

  colorPrimary: '#2563eb',
  colorSecondary: '#3b82f6',

  appBg: '#f8fafc',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#e2e8f0',
  appBorderRadius: 8,

  fontBase: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  fontCode: "ui-monospace, 'Cascadia Code', 'Fira Code', Consolas, monospace",

  textColor: '#0f172a',
  textInverseColor: '#f8fafc',
  textMutedColor: '#64748b',

  barTextColor: '#475569',
  barSelectedColor: '#2563eb',
  barHoverColor: '#1d4ed8',
  barBg: '#ffffff',

  inputBg: '#ffffff',
  inputBorder: '#cbd5e1',
  inputTextColor: '#0f172a',
  inputBorderRadius: 6,
});

export const mushiluDarkTheme = create({
  base: 'dark',

  brandTitle: 'Mushilu-San UI',
  brandUrl: 'https://github.com/Mushilu-San/ui',

  colorPrimary: '#60a5fa',
  colorSecondary: '#3b82f6',

  appBg: '#0f172a',
  appContentBg: '#1e293b',
  appPreviewBg: '#020617',
  appBorderColor: '#334155',
  appBorderRadius: 8,

  fontBase: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  fontCode: "ui-monospace, 'Cascadia Code', 'Fira Code', Consolas, monospace",

  textColor: '#f1f5f9',
  textInverseColor: '#0f172a',
  textMutedColor: '#94a3b8',

  barTextColor: '#94a3b8',
  barSelectedColor: '#60a5fa',
  barHoverColor: '#93c5fd',
  barBg: '#1e293b',

  inputBg: '#1e293b',
  inputBorder: '#475569',
  inputTextColor: '#f1f5f9',
  inputBorderRadius: 6,
});
