import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'container',
  name: 'Container',
  group: 'layout',
  selector: 'mui-container',
  apiClasses: ['Container'],
  summary: 'Centres page content and limits its width to a readable measure.',
  description: [
    'Container sets a maximum width from `size` and centres its content. `padded` adds side padding, which is on by default so content does not touch the screen edge on mobile.',
    'Wrap the main content of a page in one container so line lengths stay comfortable on wide screens.',
  ],
  whenToUse: [
    'The main content column of a page.',
    'Keeping a form or article at a readable width.',
  ],
  whenNotToUse: [
    { text: 'Arranging items next to each other. Use a Stack or a Grid.', alternative: 'stack' },
  ],
  demos: [
    {
      id: 'container-sizes',
      title: 'Sizes',
      component: () => import('./demos/container-sizes.demo').then((m) => m.ContainerSizesDemo),
    },
  ],
  guidelines: {
    do: ['Use one container for the main content of each page.'],
    dont: ['Do not nest containers. Each one adds padding and narrows the content.'],
  },
  a11y: {
    roles: [
      {
        element: 'host',
        role: '—',
        notes: 'A layout wrapper with no role. Use `<main>` around it for the main landmark.',
      },
    ],
    keyboard: [],
    notes: ['Keep the content width readable. Long lines are harder to follow.'],
  },
  tokens: ['--mui-space-4', '--mui-space-6'],
  related: ['stack', 'grid'],
};
