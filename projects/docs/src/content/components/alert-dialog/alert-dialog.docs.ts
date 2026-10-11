import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'alert-dialog',
  name: 'Alert dialog',
  group: 'feedback',
  selector: 'mui-alert-dialog',
  apiClasses: ['AlertDialog'],
  summary: 'A modal that asks the user to confirm an action before it runs, such as deleting data.',
  description: [
    'Alert dialog is a modal that interrupts the user to confirm or cancel. It is modal (`aria-modal="true"`) and linked to its body text with `aria-describedby`, so screen readers read the question with the choices.',
    'Set `destructive` for actions that cannot be undone. The confirm button then uses the danger style. `confirmed` and `cancelled` tell the page what the user chose.',
  ],
  whenToUse: [
    'Confirming an irreversible action, such as deleting a project.',
    'Warning before a change that affects other people.',
  ],
  whenNotToUse: [
    { text: 'Showing information or a form. Use a dialog.', alternative: 'dialog' },
    {
      text: 'A message that does not need an answer. Use an alert or a toast.',
      alternative: 'alert',
    },
  ],
  demos: [
    {
      id: 'alert-dialog-destructive',
      title: 'Confirm a delete',
      component: () =>
        import('./demos/alert-dialog-destructive.demo').then((m) => m.AlertDialogDestructiveDemo),
    },
  ],
  guidelines: {
    do: [
      'Name the action in the confirm label, such as "Delete project".',
      'Explain what will be lost in the body text.',
    ],
    dont: [
      'Do not use "OK" and "Cancel" when the choice has consequences.',
      'Do not open an alert dialog from another alert dialog.',
    ],
  },
  a11y: {
    roles: [
      {
        element: 'dialog',
        role: 'dialog (modal)',
        notes: '`aria-modal="true"`. Described by its body text with `aria-describedby`.',
      },
    ],
    keyboard: [{ keys: 'Tab / Shift+Tab', action: 'Cycles focus inside the dialog.' }],
    notes: [
      'Escape is ignored on purpose. The user must choose one of the two actions, so the decision is never dismissed by accident.',
    ],
  },
  tokens: [
    '--mui-color-surface-raised',
    '--mui-color-danger',
    '--mui-shadow-5',
    '--mui-z-modal',
    '--mui-color-focus-ring',
  ],
  related: ['dialog', 'alert'],
};
