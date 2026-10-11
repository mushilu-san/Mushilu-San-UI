import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'toast',
  name: 'Toast',
  group: 'feedback',
  selector: 'mui-toast-container',
  apiClasses: ['Toast', 'ToastContainer', 'ToastService'],
  summary:
    'A short, temporary message that appears at the edge of the screen and dismisses itself.',
  description: [
    'Add one `mui-toast-container` to the app, then call `ToastService` from anywhere to show a toast. `info`, `success`, `warning` and `danger` set the variant, and `duration` sets how long it stays (`0` keeps it until dismissed).',
    'Hovering or focusing a toast pauses its timer. Info and success toasts are announced politely. Warning and danger toasts are announced assertively.',
  ],
  whenToUse: [
    'Confirming an action that does not need a response, such as "Link copied".',
    'Reporting a background result the user does not have to act on.',
  ],
  whenNotToUse: [
    {
      text: 'A message the user must read before continuing. Use an alert or dialog.',
      alternative: 'alert',
    },
    {
      text: 'An error that belongs to one field. Show it next to the field.',
      alternative: 'form-field',
    },
  ],
  demos: [
    {
      id: 'toast-variants',
      title: 'Show a toast',
      component: () => import('./demos/toast-variants.demo').then((m) => m.ToastVariantsDemo),
    },
  ],
  guidelines: {
    do: [
      'Keep the message to one short sentence.',
      'Offer an action in the toast only when it saves the user effort.',
    ],
    dont: [
      'Do not show toasts for errors the user must fix.',
      'Do not stack many toasts. Show the latest result.',
    ],
  },
  a11y: {
    roles: [
      {
        element: 'container',
        role: 'region',
        notes:
          '`aria-label` from `label`, default "Notifications". A polite and an assertive live region; warning and danger use the assertive one.',
      },
      { element: 'toast', role: '—', notes: 'Announced through the live region, not focused.' },
    ],
    keyboard: [
      {
        keys: 'Tab / Shift+Tab',
        action: 'Moves focus to a toast dismiss button when one is shown.',
      },
    ],
    notes: [
      'Do not rely on a toast for information that must stay on screen. Keep the result on the page too.',
    ],
  },
  tokens: [
    '--mui-color-surface-raised',
    '--mui-color-border',
    '--mui-shadow-4',
    '--mui-z-toast',
    '--mui-color-focus-ring',
  ],
  related: ['alert'],
};
