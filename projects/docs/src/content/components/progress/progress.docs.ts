import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'progress',
  name: 'Progress',
  group: 'feedback',
  selector: 'mui-progress',
  apiClasses: ['Progress'],
  summary: 'Shows how far along a known task is, as a linear or circular bar.',
  description: [
    'Progress has `role="progressbar"` with `aria-valuenow` from `value` and `aria-valuemax` from `max`. Set `label` to describe the task, so the bar is announced with a name.',
    'Set `indeterminate` when the length of the task is unknown. The bar then animates without a value, and the host is marked `aria-busy`.',
  ],
  whenToUse: [
    'Uploads, installs and exports where the percentage is known.',
    'Steps in a multi-step process, such as 2 of 5 done.',
  ],
  whenNotToUse: [
    {
      text: 'An operation with no known progress. Use an indeterminate progress or a spinner.',
      alternative: 'spinner',
    },
  ],
  demos: [
    {
      id: 'progress-linear',
      title: 'Linear and circular',
      component: () => import('./demos/progress-linear.demo').then((m) => m.ProgressLinearDemo),
    },
    {
      id: 'progress-indeterminate',
      title: 'Indeterminate',
      component: () =>
        import('./demos/progress-indeterminate.demo').then((m) => m.ProgressIndeterminateDemo),
    },
  ],
  guidelines: {
    do: [
      'Give `label` a name for the task, such as "Uploading photos".',
      'Update the value as the task moves, not in large jumps.',
    ],
    dont: ['Do not show a progress bar that never finishes. Add an error state and a way out.'],
  },
  a11y: {
    roles: [
      {
        element: 'host',
        role: 'progressbar',
        notes:
          '`aria-valuenow` and `aria-valuemax` set; `aria-valuenow` is removed when indeterminate. `aria-busy="true"` when indeterminate.',
      },
    ],
    keyboard: [],
    notes: [
      'A progress bar is not interactive. Announce completion with an alert or toast if the user needs to know.',
    ],
  },
  tokens: ['--mui-color-primary', '--mui-color-border', '--mui-radius-full', '--mui-space-2'],
  related: ['spinner', 'skeleton'],
};
