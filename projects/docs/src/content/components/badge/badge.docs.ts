import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'badge',
  name: 'Badge',
  group: 'primitives',
  selector: 'mui-badge',
  apiClasses: ['Badge'],
  summary: 'A small label or count that marks status, category or a number of new items.',
  description: [
    'Badge shows its content in a compact pill. Set `variant` to communicate the meaning, and `size` to fit the surrounding text.',
    'With `dot` set, the badge is a small coloured marker with no text. It is hidden from assistive technology unless `label` is set, in which case the label is announced instead.',
  ],
  whenToUse: [
    'Showing a count of unread or new items next to a label.',
    'Marking the state of an item, such as "Active" or "Draft".',
  ],
  whenNotToUse: [
    { text: 'A call to action. Use a [Button](button).', alternative: 'button' },
    { text: 'A message that needs the user to act. Use an Alert.' },
  ],
  demos: [
    {
      id: 'badge-variants',
      title: 'Variants',
      component: () => import('./demos/badge-variants.demo').then((m) => m.BadgeVariantsDemo),
    },
    {
      id: 'badge-dot',
      title: 'Status dot',
      description:
        'A dot needs a `label` when the colour is the only signal, so screen readers can announce it.',
      component: () => import('./demos/badge-dot.demo').then((m) => m.BadgeDotDemo),
    },
  ],
  guidelines: {
    do: [
      'Pair the colour with text. "Active" in a success badge is clearer than green alone.',
      'Use `danger` only for states that need attention, such as a failed sync.',
    ],
    dont: [
      'Do not use a badge for a long sentence. Keep the text to a word or a short number.',
      'Do not use a dot as the only indicator of an important state without a `label`.',
    ],
  },
  a11y: {
    roles: [
      { element: 'host', role: '— (no role)', notes: 'Text badges are read as plain text.' },
      {
        element: 'dot badge',
        role: '—',
        notes:
          '`aria-hidden="true"` when there is no `label`. With a `label`, the host carries `aria-label`.',
      },
    ],
    keyboard: [],
    notes: [
      'Badges are not interactive. If a badge needs to be clicked, put it inside a button and describe the count in the button label.',
    ],
  },
  tokens: [
    '--mui-color-primary',
    '--mui-color-danger',
    '--mui-color-success',
    '--mui-color-warning',
    '--mui-color-info',
    '--mui-radius-full',
  ],
  related: ['avatar'],
};
