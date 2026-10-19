import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'typography',
  name: 'Typography',
  group: 'data-display',
  selector: 'mui-typography',
  apiClasses: ['Typography'],
  summary: 'Applies the library type scale to headings, body text, quotes and code.',
  description: [
    'Typography applies the type scale to its content. `variant` picks the style: `h1` to `h4` for headings, `p`, `lead`, `large`, `small` and `muted` for body text, and `code` and `blockquote`.',
    'Heading variants (`h1`–`h4`) are exposed as `role="heading"` with the matching `aria-level`, so screen readers see the outline.',
  ],
  whenToUse: [
    'Headings and body text that should match the type scale without a custom class.',
    'Consistent text styles across many pages.',
  ],
  whenNotToUse: [
    { text: 'A one-off piece of text with a unique style. Write it in your own stylesheet.' },
  ],
  demos: [
    {
      id: 'typography-scale',
      title: 'Type scale',
      component: () => import('./demos/typography-scale.demo').then((m) => m.TypographyScaleDemo),
    },
  ],
  guidelines: {
    do: [
      'Wrap a heading variant in a native `<h1>`–`<h4>` so the page outline stays correct.',
      'Use `large` or `lead` for emphasis that is not a heading.',
    ],
    dont: [
      'Do not rely on `variant="h1"` alone to mark a page heading.',
      'Do not pick a heading variant only for its size.',
    ],
  },
  a11y: {
    roles: [
      {
        element: 'host',
        role: '— (no role)',
        notes:
          'Heading variants get `role="heading"` and `aria-level`. Other variants have no role.',
      },
    ],
    keyboard: [],
    notes: [
      'Text contrast depends on the surrounding surface. `muted` text must still meet 4.5:1 against its background.',
    ],
  },
  tokens: [
    '--mui-font-sans',
    '--mui-font-size-base',
    '--mui-font-weight-medium',
    '--mui-color-text',
    '--mui-color-text-muted',
  ],
  related: ['card'],
};
