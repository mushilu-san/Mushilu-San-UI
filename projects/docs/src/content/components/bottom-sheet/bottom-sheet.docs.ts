import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'bottom-sheet',
  name: 'Bottom sheet',
  group: 'mobile',
  selector: 'mui-bottom-sheet',
  apiClasses: ['BottomSheet'],
  summary: 'A panel that rises from the bottom of the screen, within easy reach on a phone.',
  description: [
    'Bottom sheet is a modal panel anchored to the bottom edge. `open` is a two-way model. It has a drag handle by default (`showHandle`), closes on the backdrop and Escape unless those are turned off, and returns focus to its trigger on close.',
    'It labels itself with `heading` and is `aria-modal`, so it behaves like a dialog for assistive technology.',
  ],
  whenToUse: [
    'Choosing among actions for one item on a phone, such as "Share" or "Move to folder".',
    'A short form or filter that should stay close to the thumb.',
  ],
  whenNotToUse: [
    { text: 'Large content or a long form. Use a dialog or a full page.', alternative: 'dialog' },
    { text: 'A side panel on a desktop layout. Use a sheet.', alternative: 'sheet' },
  ],
  demos: [
    {
      id: 'bottom-sheet-actions',
      title: 'Action list',
      component: () =>
        import('./demos/bottom-sheet-actions.demo').then((m) => m.BottomSheetActionsDemo),
    },
  ],
  guidelines: {
    do: [
      'Give the sheet a heading that names the item or the action set.',
      'Keep actions to about five or fewer.',
    ],
    dont: ['Do not nest a bottom sheet inside another sheet or dialog.'],
  },
  a11y: {
    roles: [
      {
        element: 'panel',
        role: 'dialog (modal)',
        notes: '`aria-modal="true"`, named by `heading`.',
      },
      {
        element: 'handle',
        role: '—',
        notes: 'Decorative (`aria-hidden`). Dragging is a convenience, not the only way to close.',
      },
      { element: 'close button', role: 'button', notes: 'Labelled "Close".' },
    ],
    keyboard: [
      { keys: 'Tab / Shift+Tab', action: 'Cycles focus inside the sheet.' },
      { keys: 'Escape', action: 'Closes the sheet when `closeOnEscape` is on (default).' },
    ],
    notes: ['Every action must be reachable with a keyboard, not only by swiping.'],
  },
  tokens: [
    '--mui-color-surface-raised',
    '--mui-color-border',
    '--mui-shadow-5',
    '--mui-z-modal',
    '--mui-radius-md',
    '--mui-touch-target',
  ],
  related: ['sheet', 'dialog'],
};
