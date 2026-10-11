import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'empty',
  name: 'Empty state',
  group: 'data-display',
  selector: 'mui-empty',
  apiClasses: ['Empty'],
  summary:
    'A placeholder for a list or area with no content yet, with a title, text and an action.',
  description: [
    'Empty state explains why an area has no content and what to do next. Set `title` and `description`, add an icon with `slot="icon"`, and an action button with `slot="action"`.',
    'The host is `role="status"`, so the message is announced when it appears.',
  ],
  whenToUse: [
    'A list, table or search that has no results yet.',
    'A first-run screen before the user adds anything.',
  ],
  whenNotToUse: [
    { text: 'An error. Use an alert with the reason and a way to retry.', alternative: 'alert' },
  ],
  demos: [
    {
      id: 'empty-action',
      title: 'With an action',
      component: () => import('./demos/empty-action.demo').then((m) => m.EmptyActionDemo),
    },
  ],
  guidelines: {
    do: ['Say what the area is for and how to fill it.', 'Offer one clear next action.'],
    dont: [
      'Do not show an empty state while the content is still loading. Use a skeleton.',
      'Do not blame the user in the text.',
    ],
  },
  a11y: {
    roles: [
      { element: 'host', role: 'status', notes: 'Announced when it appears.' },
      { element: 'icon', role: '—', notes: 'Decorative (`aria-hidden`).' },
    ],
    keyboard: [{ keys: 'Tab / Shift+Tab', action: 'Moves focus to the action button.' }],
    notes: [
      'Keep the title meaningful on its own, since it is the first thing a screen reader user hears.',
    ],
  },
  tokens: ['--mui-color-text', '--mui-color-text-muted', '--mui-space-6'],
  related: ['skeleton', 'button'],
};
