import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'grid',
  name: 'Grid',
  group: 'layout',
  selector: 'mui-grid',
  apiClasses: ['Grid'],
  summary: 'Lays out children in a fixed number of equal columns, with gaps between them.',
  description: [
    'Grid places its children in `columns` equal tracks. `gap` sets both gaps in spacing steps, and `columnGap` or `rowGap` override one axis. `align` and `justify` set how items sit inside their cells.',
    'Use a grid for cards and tiles of the same size. Use a Stack when items flow in one direction.',
  ],
  whenToUse: [
    'A set of cards or tiles that should line up in columns.',
    'A dashboard with equal-width panels.',
  ],
  whenNotToUse: [{ text: 'A single row or column of items. Use a Stack.', alternative: 'stack' }],
  demos: [
    {
      id: 'grid-columns',
      title: 'Columns and gap',
      component: () => import('./demos/grid-columns.demo').then((m) => m.GridColumnsDemo),
    },
  ],
  guidelines: {
    do: [
      'Use fewer columns on narrow screens, such as 1 or 2, so each item keeps a readable width.',
    ],
    dont: ['Do not use a grid to fake a table. Use a Table.'],
  },
  a11y: {
    roles: [
      {
        element: 'host',
        role: '—',
        notes: 'A layout wrapper. Visual order should match reading order.',
      },
    ],
    keyboard: [],
    notes: [
      'Keep the DOM order the same as the reading order. Do not rely on CSS to reorder items for screen readers.',
    ],
  },
  tokens: ['--mui-space-4'],
  related: ['stack', 'container'],
};
