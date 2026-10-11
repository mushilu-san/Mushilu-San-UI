import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'dialog',
  name: 'Dialog',
  group: 'feedback',
  selector: 'mui-dialog',
  apiClasses: ['Dialog'],
  summary: 'A modal window for focused tasks, built on the native <dialog> element.',
  description: [
    'Dialog renders a native `<dialog>` opened with `showModal()`. The browser makes the rest of the page inert and, when the dialog closes, returns focus to the element that had it before.',
    'Open state is a two-way `open` model. Bind it with `[(open)]` and close the dialog from your own actions by setting it to `false`. The `opened` and `closed` outputs fire on each transition, and `close()` closes it imperatively.',
    'A close button is always rendered in the header, independent of `closeOnBackdrop` and `closeOnEscape`.',
  ],
  whenToUse: [
    'A short, focused task that must be finished or cancelled before continuing, such as editing a record.',
    'Content that needs the user’s full attention but not a separate page.',
  ],
  whenNotToUse: [
    { text: 'Long or multi-step flows. Use a page.' },
    { text: 'Non-blocking confirmations. Show a toast instead.' },
  ],
  demos: [
    {
      id: 'dialog-basic',
      title: 'Basic',
      description: 'Project actions into the footer with `slot="footer"`.',
      component: () => import('./demos/dialog-basic.demo').then((m) => m.DialogBasicDemo),
    },
    {
      id: 'dialog-sizes',
      title: 'Sizes',
      component: () => import('./demos/dialog-sizes.demo').then((m) => m.DialogSizesDemo),
    },
    {
      id: 'dialog-dismissal',
      title: 'Controlling dismissal',
      description:
        'Turn off `closeOnBackdrop` and `closeOnEscape` when closing by accident would lose work.',
      component: () => import('./demos/dialog-dismissal.demo').then((m) => m.DialogDismissalDemo),
    },
  ],
  guidelines: {
    do: [
      'Always set a `heading`. It becomes the dialog’s accessible name.',
      'Put actions in the `slot="footer"` area, with the primary action last.',
      'Keep the content short enough to scan without scrolling on a phone.',
    ],
    dont: [
      'Do not open a dialog on page load.',
      'Do not stack dialogs on top of each other.',
      'Do not give users no way to finish. Keep at least one visible action in the footer.',
    ],
  },
  a11y: {
    roles: [
      {
        element: 'dialog',
        role: 'dialog (native, modal)',
        notes:
          '`aria-labelledby` points at the heading when `heading` is set; otherwise the dialog has no accessible name.',
      },
      {
        element: 'close button',
        role: 'button',
        notes: 'Labelled "Close dialog"; the icon is `aria-hidden`.',
      },
    ],
    keyboard: [
      {
        keys: 'Tab / Shift+Tab',
        action: 'Moves between the controls in the dialog. The page behind is inert.',
      },
      { keys: 'Escape', action: 'Closes the dialog unless `closeOnEscape` is false.' },
    ],
    notes: [
      'Focus moves into the dialog on open (the browser picks the first focusable element, usually the close button) and returns to the element that opened it on close.',
      'The page behind the dialog is inert while it is open. This is native `showModal()` behaviour.',
      'A click on the backdrop closes the dialog unless `closeOnBackdrop` is false. This is a pointer shortcut only; keyboard users close with Escape or the close button.',
    ],
  },
  tokens: [
    '--mui-color-surface-raised',
    '--mui-color-overlay',
    '--mui-radius-lg',
    '--mui-shadow-5',
    '--mui-z-modal',
  ],
  related: ['button'],
};
