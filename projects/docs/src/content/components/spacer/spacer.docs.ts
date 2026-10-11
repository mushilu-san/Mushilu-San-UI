import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'spacer',
  name: 'Spacer',
  group: 'layout',
  selector: 'mui-spacer',
  apiClasses: ['Spacer'],
  summary: 'An empty element that adds a fixed gap or fills the free space in a flex row.',
  description: [
    'Spacer renders an empty box. Set `size` to a spacing step for a fixed gap. Without `size`, it grows to fill the free space, which pushes items apart inside a row.',
    'Spacer is hidden from assistive technology, since it carries no content.',
  ],
  whenToUse: [
    'Pushing one item to the far end of a row, such as an action at the right edge.',
    'A fixed gap between two items where a Stack gap is not enough.',
  ],
  whenNotToUse: [
    { text: 'Spacing between every item in a list. Use the gap of a Stack.', alternative: 'stack' },
  ],
  demos: [
    {
      id: 'spacer-fill',
      title: 'Fill and fixed size',
      component: () => import('./demos/spacer-fill.demo').then((m) => m.SpacerFillDemo),
    },
  ],
  guidelines: {
    do: ['Use a Stack gap for regular spacing and a Spacer for one-off placement.'],
    dont: ['Do not use spacers to create empty paragraphs. Use margins or Typography.'],
  },
  a11y: {
    roles: [{ element: 'host', role: '—', notes: '`aria-hidden="true"`. It is not announced.' }],
    keyboard: [],
    notes: ['Spacers have no content, so they do not affect the accessible name or reading order.'],
  },
  tokens: ['--mui-space-1'],
  related: ['stack', 'divider'],
};
