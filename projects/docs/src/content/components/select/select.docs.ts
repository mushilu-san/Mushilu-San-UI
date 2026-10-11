import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'select',
  name: 'Select',
  group: 'forms',
  selector: 'select[muiSelect]',
  apiClasses: ['Select'],
  summary: 'A native dropdown for choosing one value from a fixed list.',
  description: [
    'Select is applied to a native `<select>`, so the browser handles keyboard and mobile pickers. It keeps the native role and all option behaviour.',
    'As with Input, `invalid` also sets `aria-invalid="true"`, so the failed choice is announced.',
  ],
  whenToUse: [
    'Choosing one value from a list of about 5 to 20 items.',
    'Choosing a country, a category or a unit.',
  ],
  whenNotToUse: [
    {
      text: 'Choosing one of two to four options that should all be visible. Use radio buttons.',
      alternative: 'radio',
    },
    { text: 'Choosing from a long, searchable list. Use a combobox.' },
  ],
  demos: [
    {
      id: 'select-basic',
      title: 'Basic select',
      component: () => import('./demos/select-basic.demo').then((m) => m.SelectBasicDemo),
    },
    {
      id: 'select-variants',
      title: 'Sizes and variants',
      component: () => import('./demos/select-variants.demo').then((m) => m.SelectVariantsDemo),
    },
  ],
  guidelines: {
    do: ['Put a placeholder option first, such as "Choose a country", and make it disabled.'],
    dont: ['Do not use a select for a list of two items. Use radio buttons.'],
  },
  a11y: {
    roles: [
      {
        element: 'select[muiSelect]',
        role: 'combobox (native)',
        notes: '`invalid` sets `data-invalid` and `aria-invalid="true"`.',
      },
    ],
    keyboard: [
      { keys: 'Tab / Shift+Tab', action: 'Moves focus to and from the select.' },
      {
        keys: 'Arrow keys / Space / Enter',
        action: 'Open the list and move through options (native behaviour).',
      },
    ],
    notes: ['Name the select with a `<label>` or `aria-label`.'],
  },
  tokens: [
    '--mui-color-surface',
    '--mui-color-border',
    '--mui-color-text',
    '--mui-color-focus-ring',
    '--mui-touch-target',
  ],
  related: ['radio', 'input', 'combobox'],
};
