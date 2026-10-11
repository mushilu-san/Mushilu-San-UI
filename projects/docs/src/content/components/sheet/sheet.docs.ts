import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'sheet',
  name: 'Sheet',
  group: 'feedback',
  selector: 'mui-sheet',
  apiClasses: ['Sheet'],
  summary: 'A panel that slides in from an edge of the screen for secondary tasks.',
  description: [
    'Sheet is a modal panel anchored to one edge, set with `side`: `start`, `end`, `top` or `bottom`. `left` and `right` are physical aliases. `open` is a two-way model.',
    'It traps focus while open, closes on Escape and on the backdrop unless those are turned off, and returns focus to the trigger when it closes.',
  ],
  whenToUse: [
    'Filters, details or a settings panel that should not leave the current page.',
    'A side panel for editing an item from a list.',
  ],
  whenNotToUse: [
    { text: 'A short confirmation. Use an alert dialog.', alternative: 'alert-dialog' },
    {
      text: 'A bottom panel on a phone that a thumb should reach. Use a bottom sheet.',
      alternative: 'bottom-sheet',
    },
  ],
  demos: [
    {
      id: 'sheet-right',
      title: 'Side panel',
      component: () => import('./demos/sheet-right.demo').then((m) => m.SheetRightDemo),
    },
  ],
  guidelines: {
    do: [
      'Give the sheet a heading that says what it is for.',
      'Put the primary action in a footer slot.',
    ],
    dont: ['Do not nest sheets on top of each other.'],
  },
  a11y: {
    roles: [
      {
        element: 'panel',
        role: 'dialog (modal)',
        notes: '`aria-modal="true"`. Named by `heading` when set.',
      },
    ],
    keyboard: [
      { keys: 'Tab / Shift+Tab', action: 'Cycles focus inside the sheet.' },
      { keys: 'Escape', action: 'Closes the sheet when `closeOnEscape` is on (default).' },
    ],
    notes: [
      'Focus returns to the element that opened the sheet. Give the close button a clear label.',
    ],
  },
  tokens: [
    '--mui-color-surface-raised',
    '--mui-color-border',
    '--mui-shadow-5',
    '--mui-z-modal',
    '--mui-color-focus-ring',
  ],
  related: ['dialog', 'bottom-sheet'],
};
