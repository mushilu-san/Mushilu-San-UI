import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'fab',
  name: 'Floating action button',
  group: 'mobile',
  selector: 'mui-fab',
  apiClasses: ['Fab'],
  summary: 'A round or extended button that floats over the page for the main action of a screen.',
  description: [
    'Fab is a floating button, usually in a corner. `label` is required: it is the accessible name, and it is shown as text when `extended` is on. `variant` and `size` set the look.',
    'Set `loading` while the action runs. The button stays in the tab order, gets `aria-busy="true"` and ignores clicks. `disabled` uses `aria-disabled` instead of removing focus.',
  ],
  whenToUse: [
    'One primary action per screen, such as "Compose" or "Add item".',
    'A screen where the main action should stay visible while scrolling.',
  ],
  whenNotToUse: [
    { text: 'Several equal actions. Use buttons in the page.', alternative: 'button' },
  ],
  demos: [
    {
      id: 'fab-variants',
      title: 'Variants and extended',
      component: () => import('./demos/fab-variants.demo').then((m) => m.FabVariantsDemo),
    },
  ],
  guidelines: {
    do: [
      'Use an icon and a verb label, such as "Compose".',
      'Use the extended form when the action needs a word to be understood.',
    ],
    dont: ['Do not place a FAB over content the user needs to read.'],
  },
  a11y: {
    roles: [
      {
        element: 'button',
        role: 'button (native)',
        notes:
          '`aria-label` from `label` when not extended. `aria-busy` while loading, `aria-disabled` when disabled.',
      },
    ],
    keyboard: [
      { keys: 'Tab / Shift+Tab', action: 'Moves focus to the button.' },
      { keys: 'Enter / Space', action: 'Activates the button.' },
    ],
    notes: ['The icon is decorative. The label is the only name, so keep it meaningful.'],
  },
  tokens: [
    '--mui-color-primary',
    '--mui-color-primary-text',
    '--mui-shadow-4',
    '--mui-radius-full',
    '--mui-color-focus-ring',
    '--mui-touch-target',
  ],
  related: ['button', 'bottom-sheet'],
};
