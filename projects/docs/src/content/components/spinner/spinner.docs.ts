import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'spinner',
  name: 'Spinner',
  group: 'primitives',
  selector: 'mui-spinner',
  apiClasses: ['Spinner'],
  summary: 'An animated indicator that shows work is in progress and the page is waiting.',
  description: [
    'Spinner has `role="status"` and an `aria-label` from `label` (default "Loading"), so screen readers announce that work is in progress.',
    'The graphic inside is decorative. When the user prefers reduced motion, the spin is replaced by a slower pulse, and the status text still conveys the state.',
  ],
  whenToUse: [
    'Waiting for a short operation where the layout does not yet know the final content.',
    'Showing progress inside a [Button](button) while it is loading, or next to a region that is refreshing.',
  ],
  whenNotToUse: [
    {
      text: 'Operations with a known duration. Use Progress so the user sees how far along it is.',
    },
    { text: 'Loading a whole page of content. Use Skeleton to show the shape of what is coming.' },
  ],
  demos: [
    {
      id: 'spinner-sizes',
      title: 'Sizes and colours',
      component: () => import('./demos/spinner-sizes.demo').then((m) => m.SpinnerSizesDemo),
    },
    {
      id: 'spinner-label',
      title: 'Custom label',
      description: 'Change `label` to describe what is loading, so the announcement is useful.',
      component: () => import('./demos/spinner-label.demo').then((m) => m.SpinnerLabelDemo),
    },
  ],
  guidelines: {
    do: [
      'Set `label` to describe the operation, such as "Saving draft".',
      'Keep the surrounding content visible while the spinner runs when possible.',
    ],
    dont: [
      'Do not show a spinner forever. Add a timeout and an error message.',
      'Do not hide the spinner with `display: none` while work is still running, or the status is lost.',
    ],
  },
  a11y: {
    roles: [
      { element: 'host', role: 'status', notes: '`aria-label` comes from `label`.' },
      { element: 'svg', role: '—', notes: '`aria-hidden="true"`, decorative.' },
    ],
    keyboard: [],
    notes: [
      'Use `aria-busy="true"` on the region that is loading, so assistive technology knows it is updating.',
    ],
  },
  tokens: [
    '--mui-color-primary',
    '--mui-color-text-muted',
    '--mui-color-danger',
    '--mui-color-success',
    '--mui-color-warning',
  ],
  related: ['button'],
};
