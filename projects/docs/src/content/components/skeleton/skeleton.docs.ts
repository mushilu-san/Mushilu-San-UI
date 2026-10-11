import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'skeleton',
  name: 'Skeleton',
  group: 'feedback',
  selector: 'mui-skeleton',
  apiClasses: ['Skeleton'],
  summary: 'A grey placeholder that shows the shape of content while it loads.',
  description: [
    'Skeleton draws a pulsing block in the shape of the content to come: `text` lines, a `rect` or a `circle`. Set `lines` for several text lines and `width` or `height` to match the final layout.',
    'The skeleton is decorative. The region that is loading should carry `aria-busy="true"`, and a label or the final content tells the user when it is ready.',
  ],
  whenToUse: [
    'A card or list that takes a moment to load, so the layout does not jump.',
    'Matching the final shape of a profile, article or table.',
  ],
  whenNotToUse: [
    { text: 'An unknown wait with no shape to show. Use a spinner.', alternative: 'spinner' },
  ],
  demos: [
    {
      id: 'skeleton-card',
      title: 'Loading card',
      component: () => import('./demos/skeleton-card.demo').then((m) => m.SkeletonCardDemo),
    },
  ],
  guidelines: {
    do: [
      'Match the size of the skeleton to the content it replaces.',
      'Remove the skeleton as soon as the content is ready.',
    ],
    dont: ['Do not leave skeletons on screen after a failed load. Show an error instead.'],
  },
  a11y: {
    roles: [
      {
        element: 'host',
        role: '—',
        notes: 'Decorative. Set `aria-busy="true"` on the region that is loading.',
      },
    ],
    keyboard: [],
    notes: ['Reduced motion stops the pulse. Screen readers do not read skeleton blocks.'],
  },
  tokens: ['--mui-color-surface-raised', '--mui-color-border', '--mui-radius-md'],
  related: ['spinner', 'progress'],
};
