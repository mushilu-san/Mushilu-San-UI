import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'popover',
  name: 'Popover',
  group: 'overlays',
  selector: 'mui-popover',
  apiClasses: ['Popover', 'PopoverTrigger'],
  summary: 'A floating panel that opens from a trigger and holds richer content than a menu.',
  description: [
    'Popover opens a panel next to a `muiPopoverTrigger` element. `open` is a two-way model, `placement` sets the side, and `heading` names the panel.',
    'The panel closes on Escape and on a click outside, unless `closeOnEscape` or `closeOnOutsideClick` are turned off. The trigger carries `aria-expanded` and `aria-haspopup`.',
  ],
  whenToUse: [
    'A small form, filter or details panel tied to one button.',
    'Richer content than a menu list can hold.',
  ],
  whenNotToUse: [
    { text: 'A list of actions. Use a dropdown menu.', alternative: 'dropdown-menu' },
    { text: 'A short hint on hover. Use a tooltip.', alternative: 'tooltip' },
  ],
  demos: [
    {
      id: 'popover-filter',
      title: 'Filter panel',
      component: () => import('./demos/popover-filter.demo').then((m) => m.PopoverFilterDemo),
    },
  ],
  guidelines: {
    do: [
      'Give the panel a heading that says what it is for.',
      'Put focus inside the panel when it has form fields.',
    ],
    dont: ['Do not open a popover on hover. Use a hover card for that.'],
  },
  a11y: {
    roles: [
      {
        element: 'trigger',
        role: 'button (native)',
        notes: '`aria-expanded` and `aria-haspopup` are set automatically.',
      },
      { element: 'panel', role: 'dialog', notes: 'Set with `aria-modal="true"`.' },
    ],
    keyboard: [
      { keys: 'Enter / Space', action: 'Opens the panel from the trigger.' },
      { keys: 'Escape', action: 'Closes the panel and returns focus to the trigger.' },
      { keys: 'Tab / Shift+Tab', action: 'Moves focus through the panel while it is open.' },
    ],
    notes: ['Name the panel with `heading`, since it is announced when it opens.'],
  },
  tokens: [
    '--mui-color-surface-raised',
    '--mui-color-border',
    '--mui-shadow-4',
    '--mui-radius-md',
    '--mui-color-focus-ring',
  ],
  related: ['hover-card', 'dropdown-menu', 'tooltip'],
};
