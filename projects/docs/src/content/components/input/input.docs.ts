import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'input',
  name: 'Input',
  group: 'forms',
  selector: 'input[muiInput]',
  apiClasses: ['Input'],
  summary: 'A single-line text field with sizes, visual variants and an invalid state.',
  description: [
    'Input is applied to a native `<input>`, so it keeps the native role, value handling and autofill. Pair it with a `<label>` or a [Form field](form-field).',
    'Set `invalid` for the failed-validation styling. The component adds `data-invalid` only, so also set `aria-invalid="true"` and link an error message with `aria-describedby`.',
  ],
  whenToUse: [
    'Collecting a short piece of text, such as a name, email or search term.',
    'Any single-line value that the user types.',
  ],
  whenNotToUse: [
    { text: 'More than one line of text. Use a textarea.', alternative: 'textarea' },
    { text: 'Choosing from a fixed list of values. Use a select.', alternative: 'select' },
  ],
  demos: [
    {
      id: 'input-basic',
      title: 'With a label and hint',
      component: () => import('./demos/input-basic.demo').then((m) => m.InputBasicDemo),
    },
    {
      id: 'input-variants',
      title: 'Sizes and variants',
      component: () => import('./demos/input-variants.demo').then((m) => m.InputVariantsDemo),
    },
  ],
  guidelines: {
    do: [
      'Always give an input a visible label. Placeholder text is not a label.',
      'Use the right `type` (`email`, `tel`, `search`) so mobile keyboards match.',
    ],
    dont: [
      'Do not use placeholder text as the only instruction.',
      'Do not show an error without telling the user how to fix it.',
    ],
  },
  a11y: {
    roles: [
      {
        element: 'input[muiInput]',
        role: 'textbox (native)',
        notes: '`invalid` adds `data-invalid` only. Set `aria-invalid="true"` yourself.',
      },
    ],
    keyboard: [{ keys: 'Tab / Shift+Tab', action: 'Moves focus to and from the field.' }],
    notes: [
      'Name the field with a `<label>` or `aria-label`. Use `autocomplete` for personal data.',
    ],
  },
  tokens: [
    '--mui-color-surface',
    '--mui-color-border',
    '--mui-color-text',
    '--mui-color-focus-ring',
    '--mui-color-danger',
    '--mui-touch-target',
  ],
  related: ['form-field', 'textarea', 'select'],
};
