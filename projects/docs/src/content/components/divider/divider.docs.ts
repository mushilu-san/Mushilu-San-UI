import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'divider',
  name: 'Divider',
  group: 'primitives',
  selector: 'mui-divider',
  apiClasses: ['Divider'],
  summary: 'A thin line that separates sections of content, optionally with a label.',
  description: [
    'Divider has `role="separator"`, so screen readers announce a boundary between sections. Its orientation is exposed as `aria-orientation`.',
    'A labelled divider draws the label between two lines. The label is decorative and hidden from assistive technology, so use a heading when the text is a section title.',
  ],
  whenToUse: [
    'Separating groups of items in a menu, list or form.',
    'Splitting two alternatives, such as "or" between sign-in options.',
  ],
  whenNotToUse: [
    { text: 'Creating space between elements. Use Spacer or a Stack gap.' },
    { text: 'Marking a new section title. Use a heading.' },
  ],
  demos: [
    {
      id: 'divider-labelled',
      title: 'Labelled',
      component: () => import('./demos/divider-labelled.demo').then((m) => m.DividerLabelledDemo),
    },
    {
      id: 'divider-vertical',
      title: 'Vertical and styles',
      description: 'Use a vertical divider between items in a horizontal row.',
      component: () => import('./demos/divider-vertical.demo').then((m) => m.DividerVerticalDemo),
    },
  ],
  guidelines: {
    do: ['Use one divider per boundary. Keep the number of separators low.'],
    dont: [
      'Do not stack two dividers with nothing between them.',
      'Do not rely on the label alone to say what a section is, if a screen reader user needs it. Add a heading.',
    ],
  },
  a11y: {
    roles: [
      { element: 'host', role: 'separator', notes: '`aria-orientation` follows `orientation`.' },
      {
        element: 'label',
        role: '—',
        notes: 'Hidden from assistive technology with `aria-hidden="true"`.',
      },
    ],
    keyboard: [],
    notes: ['A divider is not focusable and has no keyboard behaviour.'],
  },
  tokens: ['--mui-color-border', '--mui-color-text-muted', '--mui-space-2'],
  related: [],
};
