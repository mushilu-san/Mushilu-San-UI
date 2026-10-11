import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'alert',
  name: 'Alert',
  group: 'feedback',
  selector: 'mui-alert',
  apiClasses: ['Alert'],
  summary:
    'An inline message that tells the user about a success, warning, error or information on the page.',
  description: [
    'Alert shows a message in place, next to the content it relates to. `variant` sets the meaning: `info`, `success`, `warning` or `danger`.',
    '`warning` and `danger` alerts are `role="alert"` (assertive), so they interrupt. `info` and `success` are `role="status"` (polite). Set `dismissible` to show a close button that emits `dismissed`.',
  ],
  whenToUse: [
    'Confirming a result on the page, such as "Changes saved".',
    'Warning about a problem that affects the content nearby.',
  ],
  whenNotToUse: [
    { text: 'A brief message that disappears on its own. Use a toast.', alternative: 'toast' },
    {
      text: 'A decision the user must make before continuing. Use an alert dialog.',
      alternative: 'alert-dialog',
    },
  ],
  demos: [
    {
      id: 'alert-variants',
      title: 'Variants',
      component: () => import('./demos/alert-variants.demo').then((m) => m.AlertVariantsDemo),
    },
  ],
  guidelines: {
    do: [
      'Say what happened and what to do next in the message.',
      'Use the variant that matches the severity.',
    ],
    dont: ['Do not stack several alerts on one page.', 'Do not use `danger` for a minor issue.'],
  },
  a11y: {
    roles: [
      {
        element: 'host',
        role: 'status or alert',
        notes:
          '`role="alert"` for `warning` and `danger`, otherwise `role="status"`. `aria-live` follows the role.',
      },
      { element: 'dismiss button', role: 'button', notes: 'Has a visible close label.' },
    ],
    keyboard: [
      {
        keys: 'Tab / Shift+Tab',
        action: 'Moves focus to the dismiss button when `dismissible` is set.',
      },
    ],
    notes: [
      'Do not move focus to an alert when it appears. Screen readers announce it from the live region.',
    ],
  },
  tokens: [
    '--mui-color-success-subtle',
    '--mui-color-warning-subtle',
    '--mui-color-danger-subtle',
    '--mui-color-primary-subtle',
    '--mui-radius-md',
    '--mui-color-focus-ring',
  ],
  related: ['toast', 'alert-dialog'],
};
