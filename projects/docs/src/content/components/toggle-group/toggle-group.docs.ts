import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'toggle-group',
  name: 'Toggle group',
  group: 'forms',
  selector: 'mui-toggle-group',
  apiClasses: ['ToggleGroup', 'ToggleGroupItem'],
  summary: 'A row of toggle buttons where one or several can be pressed.',
  description: [
    'Toggle group is a `role="group"` of items. Each item is a button with `aria-pressed`, so screen readers announce whether it is on.',
    'Set `type` to `single` for one selected item, such as text alignment, or `multiple` when several can be on. `value` is a two-way model that holds the selected item values.',
  ],
  whenToUse: [
    'Switching between a few modes or formats, such as text alignment or a view mode.',
    'Choosing a small set of filters where the choices are visible at once.',
  ],
  whenNotToUse: [
    { text: 'Navigating between views. Use tabs.', alternative: 'tabs' },
    { text: 'More than about five options. Use a select.', alternative: 'select' },
  ],
  demos: [
    {
      id: 'toggle-group-single',
      title: 'Single selection',
      component: () =>
        import('./demos/toggle-group-single.demo').then((m) => m.ToggleGroupSingleDemo),
    },
  ],
  guidelines: {
    do: ['Give every item a visible text label or an icon with an accessible label.'],
    dont: ['Do not use a toggle group for an action that does not stay pressed.'],
  },
  a11y: {
    roles: [
      {
        element: 'host',
        role: 'group',
        notes: 'Name it with `aria-label` when the context is not clear.',
      },
      {
        element: 'item',
        role: '—',
        notes: '`aria-pressed` reflects the on state. `aria-disabled` when disabled.',
      },
    ],
    keyboard: [
      { keys: 'Tab / Shift+Tab', action: 'Moves focus into and out of the group.' },
      { keys: 'Enter / Space', action: 'Presses or releases the focused item.' },
    ],
    notes: ['Label the group so screen reader users know what the choice is for.'],
  },
  tokens: [
    '--mui-color-primary',
    '--mui-color-primary-text',
    '--mui-color-border',
    '--mui-color-focus-ring',
    '--mui-touch-target',
  ],
  related: ['tabs'],
};
