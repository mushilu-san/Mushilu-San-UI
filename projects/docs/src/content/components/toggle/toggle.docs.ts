import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'toggle',
  name: 'Toggle',
  group: 'forms',
  selector: 'mui-toggle',
  apiClasses: ['Toggle'],
  summary: 'An on/off switch for a setting that takes effect immediately.',
  description: [
    'Toggle has `role="switch"` and `aria-checked`. Its `checked` model is two-way bindable. Set `label` so the switch has an accessible name.',
    'Use a toggle when the change applies right away. For a choice that is submitted with a form, use a checkbox.',
  ],
  whenToUse: [
    'Turning a feature or notification on or off.',
    'A setting where the change is saved or visible immediately.',
  ],
  whenNotToUse: [
    { text: 'A choice that is submitted with a form. Use a checkbox.', alternative: 'checkbox' },
  ],
  demos: [
    {
      id: 'toggle-basic',
      title: 'Settings',
      component: () => import('./demos/toggle-basic.demo').then((m) => m.ToggleBasicDemo),
    },
    {
      id: 'toggle-sizes',
      title: 'Sizes and disabled',
      component: () => import('./demos/toggle-sizes.demo').then((m) => m.ToggleSizesDemo),
    },
  ],
  guidelines: {
    do: ['Use a label that describes the setting, not the state. "Email alerts", not "On".'],
    dont: ['Do not use a toggle for an action, such as "Send". Use a button.'],
  },
  a11y: {
    roles: [
      {
        element: 'host',
        role: 'switch',
        notes: '`aria-checked` follows `checked`. `aria-disabled` when disabled.',
      },
    ],
    keyboard: [
      { keys: 'Tab / Shift+Tab', action: 'Moves focus to and from the switch.' },
      { keys: 'Space / Enter', action: 'Toggles the switch.' },
    ],
    notes: ['Set `label` on the switch, or give it an `aria-label`.'],
  },
  tokens: [
    '--mui-color-primary',
    '--mui-color-border',
    '--mui-color-surface',
    '--mui-color-focus-ring',
    '--mui-touch-target',
  ],
  related: ['checkbox'],
};
