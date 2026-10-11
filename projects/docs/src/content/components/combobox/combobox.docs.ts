import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'combobox',
  name: 'Combobox',
  group: 'overlays',
  selector: 'mui-combobox',
  apiClasses: ['Combobox', 'ComboboxItem'],
  summary: 'A button that opens a searchable list of options to choose one value from.',
  description: [
    'Combobox shows the chosen value in a trigger button and opens a `role="listbox"` panel of `mui-combobox-item` options. `value` is a two-way model that holds the chosen item value.',
    'Escape closes the panel and returns focus to the trigger. Use it when the list is too long for a native select.',
  ],
  whenToUse: [
    'Choosing one value from a long list, such as a country, a user or a product.',
    'Lists where users know part of the name.',
  ],
  whenNotToUse: [
    {
      text: 'A short fixed list. Use a select, which is simpler and works natively on phones.',
      alternative: 'select',
    },
    { text: 'Running a command. Use a command palette.', alternative: 'command' },
  ],
  demos: [
    {
      id: 'combobox-basic',
      title: 'Choose one',
      component: () => import('./demos/combobox-basic.demo').then((m) => m.ComboboxBasicDemo),
    },
  ],
  guidelines: {
    do: [
      'Give the trigger a label that names the field.',
      'Show the chosen value in the trigger so the choice is visible.',
    ],
    dont: ['Do not use a combobox for two or three options. Use radio buttons or a select.'],
  },
  a11y: {
    roles: [
      {
        element: 'trigger',
        role: 'button with aria-haspopup="listbox"',
        notes: '`aria-expanded` follows the panel.',
      },
      {
        element: 'panel',
        role: 'listbox',
        notes: 'Options are `role="option"`, with `aria-selected` on the chosen one.',
      },
    ],
    keyboard: [
      { keys: 'Enter / Space', action: 'Opens the panel on the trigger.' },
      { keys: 'Escape', action: 'Closes the panel and returns focus to the trigger.' },
    ],
    notes: [
      'Label the trigger with the field name. The chosen value is announced when the panel closes.',
    ],
  },
  tokens: [
    '--mui-color-surface-raised',
    '--mui-color-border',
    '--mui-shadow-3',
    '--mui-color-primary-subtle',
    '--mui-color-focus-ring',
    '--mui-touch-target',
  ],
  related: ['select', 'command'],
};
