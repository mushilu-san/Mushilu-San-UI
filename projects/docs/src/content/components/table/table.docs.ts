import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'table',
  name: 'Table',
  group: 'data-display',
  selector: 'mui-table',
  apiClasses: ['Table'],
  summary: 'A data table with column headers, optional sorting and a sticky header.',
  description: [
    'Table renders a native `<table>` from `columns` and `rows`. Columns marked `sortable` get a sort button in the header, and `sortChange` emits the new `key` and direction.',
    'Each header cell has `scope="col"`, and the sorted column carries `aria-sort`. Set `caption` to name the table for screen readers.',
  ],
  whenToUse: [
    'Records with the same fields that users compare or sort.',
    'Data with more than a few columns, where a list would be hard to scan.',
  ],
  whenNotToUse: [
    { text: 'Layout of unrelated content. Use a Grid or a Stack.', alternative: 'grid' },
    { text: 'A short list of single values. Use a list of text.' },
  ],
  demos: [
    {
      id: 'table-sortable',
      title: 'Sortable columns',
      component: () => import('./demos/table-sortable.demo').then((m) => m.TableSortableDemo),
    },
  ],
  guidelines: {
    do: [
      'Give the table a caption that says what it lists.',
      'Right-align numbers so they compare easily.',
    ],
    dont: [
      'Do not use a table for layout.',
      'Do not sort on a column the user cannot see the meaning of.',
    ],
  },
  a11y: {
    roles: [
      {
        element: 'host',
        role: 'region',
        notes: 'Scrollable region when the table is wider than its box.',
      },
      {
        element: 'header cell',
        role: 'columnheader (native)',
        notes: '`scope="col"`. `aria-sort` on the sorted column.',
      },
    ],
    keyboard: [
      { keys: 'Tab / Shift+Tab', action: 'Moves focus between sort buttons.' },
      { keys: 'Enter / Space', action: 'Sorts by the focused column.' },
    ],
    notes: [
      'Keep the header row meaningful when read out, and avoid merged cells, which screen readers handle poorly.',
    ],
  },
  tokens: [
    '--mui-color-surface',
    '--mui-color-border',
    '--mui-color-text-muted',
    '--mui-color-focus-ring',
    '--mui-font-size-sm',
  ],
  related: ['chart', 'scroll-area', 'pagination'],
};
