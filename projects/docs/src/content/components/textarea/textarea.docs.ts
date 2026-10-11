import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'textarea',
  name: 'Textarea',
  group: 'forms',
  selector: 'textarea[muiTextarea]',
  apiClasses: ['Textarea'],
  summary: 'A multi-line text field for longer free-form input.',
  description: [
    'Textarea is applied to a native `<textarea>`. Set `resize` to control whether the user can resize it: `vertical` by default, `none` to fix the size, or `both`.',
    'As with Input, `invalid` only adds `data-invalid`. Set `aria-invalid="true"` yourself and link the error message.',
  ],
  whenToUse: [
    'A comment, description or message that can span several lines.',
    'Any free-form text where the length is not known in advance.',
  ],
  whenNotToUse: [
    { text: 'A single line, such as a name or email. Use an input.', alternative: 'input' },
  ],
  demos: [
    {
      id: 'textarea-basic',
      title: 'With a label',
      component: () => import('./demos/textarea-basic.demo').then((m) => m.TextareaBasicDemo),
    },
    {
      id: 'textarea-resize',
      title: 'Sizes and resize',
      component: () => import('./demos/textarea-resize.demo').then((m) => m.TextareaResizeDemo),
    },
  ],
  guidelines: {
    do: [
      'Show a character count when there is a limit.',
      'Keep the default vertical resize so long text can grow.',
    ],
    dont: ['Do not disable resizing on a field where users write long text.'],
  },
  a11y: {
    roles: [
      {
        element: 'textarea[muiTextarea]',
        role: 'textbox (native)',
        notes: '`invalid` adds `data-invalid` only.',
      },
    ],
    keyboard: [
      { keys: 'Tab / Shift+Tab', action: 'Moves focus to and from the textarea.' },
      { keys: 'Enter', action: 'Inserts a new line.' },
    ],
    notes: ['Name the textarea with a `<label>` or `aria-label`.'],
  },
  tokens: [
    '--mui-color-surface',
    '--mui-color-border',
    '--mui-color-text',
    '--mui-color-focus-ring',
    '--mui-radius-md',
  ],
  related: ['input', 'form-field'],
};
