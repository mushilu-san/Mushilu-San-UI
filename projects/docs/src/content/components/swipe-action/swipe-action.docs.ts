import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'swipe-action',
  name: 'Swipe action',
  group: 'mobile',
  selector: 'mui-swipe-action',
  apiClasses: ['SwipeAction'],
  summary: 'A list row that reveals action buttons when swiped, such as delete or archive.',
  description: [
    'Swipe action wraps a list row. Dragging the row sideways reveals the `actions`, and `actionTriggered` emits the `key` of the chosen action. Each action sets a `side`, `start` or `end`, which flips in RTL.',
    'Keyboard and screen reader users get the same actions as a button list, labelled "Row actions", so swiping is never the only way in.',
  ],
  whenToUse: [
    'Per-row shortcuts in a phone list, such as archive or delete.',
    'Lists where the same two or three actions apply to every row.',
  ],
  whenNotToUse: [
    {
      text: 'Actions that need a confirmation or explanation. Use a dialog.',
      alternative: 'alert-dialog',
    },
    { text: 'Actions users must discover on desktop. Show them in the row.' },
  ],
  demos: [
    {
      id: 'swipe-action-basic',
      title: 'Archive and delete',
      component: () =>
        import('./demos/swipe-action-basic.demo').then((m) => m.SwipeActionBasicDemo),
    },
  ],
  guidelines: {
    do: ['Use colour and a text label on each action.', 'Put the most destructive action last.'],
    dont: ['Do not make a destructive action the only way to delete a row. Confirm it.'],
  },
  a11y: {
    roles: [
      { element: 'row', role: 'listitem', notes: 'The track is a listitem inside your list.' },
      {
        element: 'more actions button',
        role: 'button',
        notes: '`aria-expanded` follows the reveal state.',
      },
      {
        element: 'action group',
        role: 'group',
        notes: 'Labelled "Row actions" with the same actions as buttons.',
      },
    ],
    keyboard: [
      { keys: 'Tab / Shift+Tab', action: 'Moves through the row and its action buttons.' },
      { keys: 'Enter / Space', action: 'Triggers the focused action.' },
    ],
    notes: ['Put the rows inside a list, so each row is announced as a list item.'],
  },
  tokens: [
    '--mui-color-danger',
    '--mui-color-success',
    '--mui-color-warning',
    '--mui-color-primary',
    '--mui-color-surface',
    '--mui-touch-target',
  ],
  related: ['bottom-sheet', 'alert-dialog'],
};
