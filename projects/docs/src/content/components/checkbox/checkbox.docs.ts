import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'checkbox',
  name: 'Checkbox',
  group: 'forms',
  selector: 'input[type=checkbox][muiCheckbox]',
  apiClasses: ['Checkbox'],
  summary: 'A native checkbox for selecting one or more independent options.',
  description: [
    'Checkbox is applied to a native `<input type="checkbox">`, so it keeps the native role, checked state and Space key behaviour. Pair it with a `<label>` so the whole label is clickable.',
    'Set `invalid` to show the failed-validation styling (`data-invalid`). The component does not set `aria-invalid`, so also set it yourself and link an error message with `aria-describedby`.',
  ],
  whenToUse: [
    'Choosing any number of options from a list, such as notification types.',
    'Accepting a single yes/no agreement, such as terms of service.',
  ],
  whenNotToUse: [
    { text: 'Choosing exactly one option from a set. Use radio buttons.' },
    {
      text: 'Switching a setting on or off that takes effect immediately. Use a toggle.',
      alternative: 'toggle',
    },
  ],
  demos: [
    {
      id: 'checkbox-group',
      title: 'Group of options',
      component: () => import('./demos/checkbox-group.demo').then((m) => m.CheckboxGroupDemo),
    },
    {
      id: 'checkbox-states',
      title: 'Sizes and invalid state',
      component: () => import('./demos/checkbox-states.demo').then((m) => m.CheckboxStatesDemo),
    },
  ],
  guidelines: {
    do: [
      'Always label each checkbox with visible text.',
      'Group related checkboxes under a shared heading or a fieldset with a legend.',
    ],
    dont: [
      'Do not use a checkbox for a choice that has only one option. Use a toggle for an immediate setting.',
      'Do not rely on colour alone to show the invalid state. Include an error message.',
    ],
  },
  a11y: {
    roles: [
      {
        element: 'input[type=checkbox]',
        role: 'checkbox (native)',
        notes:
          '`invalid` adds `data-invalid` for styling only. Set `aria-invalid="true"` yourself.',
      },
    ],
    keyboard: [
      { keys: 'Tab / Shift+Tab', action: 'Moves focus to and from the checkbox.' },
      { keys: 'Space', action: 'Toggles the checkbox.' },
    ],
    notes: [
      'Give each checkbox an accessible name from its label, or with `aria-label` when there is no visible label.',
    ],
  },
  tokens: [
    '--mui-color-primary',
    '--mui-color-border',
    '--mui-color-danger',
    '--mui-color-focus-ring',
    '--mui-touch-target',
  ],
  related: ['toggle', 'radio'],
};
