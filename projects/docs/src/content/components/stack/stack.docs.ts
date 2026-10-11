import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'stack',
  name: 'Stack',
  group: 'layout',
  selector: 'mui-stack',
  apiClasses: ['Stack'],
  summary: 'Arranges children in a row or column with a consistent gap.',
  description: [
    'Stack is a flex container. `direction` sets the axis, `gap` sets the space between children in spacing steps, and `align` and `justify` set how items sit along each axis. `wrap` lets a row break onto new lines.',
    'Stack is the default tool for spacing a set of related elements, such as a form or a card body.',
  ],
  whenToUse: [
    'Spacing a list of fields, buttons or text in one direction.',
    'Aligning items in a row, such as a label and an action.',
  ],
  whenNotToUse: [{ text: 'Equal-width items in columns. Use a Grid.', alternative: 'grid' }],
  demos: [
    {
      id: 'stack-direction',
      title: 'Column and row',
      component: () => import('./demos/stack-direction.demo').then((m) => m.StackDirectionDemo),
    },
  ],
  guidelines: {
    do: [
      'Use the same gap for related items throughout a page.',
      'Use `wrap` for rows of tags or buttons that may not fit.',
    ],
    dont: ['Do not nest stacks just to add spacing. Use one stack with a gap.'],
  },
  a11y: {
    roles: [
      {
        element: 'host',
        role: '—',
        notes: 'A layout wrapper. Keep the DOM order the same as the reading order.',
      },
    ],
    keyboard: [],
    notes: [
      'Visual order from `direction="row-reverse"` or `column-reverse` does not change the tab order. Avoid reversing content that users read in sequence.',
    ],
  },
  tokens: ['--mui-space-2', '--mui-space-4'],
  related: ['grid', 'spacer'],
};
