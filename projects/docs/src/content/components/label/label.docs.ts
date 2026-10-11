import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'label',
  name: 'Label',
  group: 'forms',
  selector: 'mui-label',
  apiClasses: ['Label'],
  summary: 'A styled text label linked to a form control, with a required marker.',
  description: [
    'Label renders a native `<label>` and links it to the control with `for`. Clicking the label focuses the control, and screen readers read the label as the control name.',
    'Set `required` to show the required marker. The marker is decorative (`aria-hidden`), so also mark the control itself with `required`.',
  ],
  whenToUse: [
    'Naming any form control that is not wrapped in a [Form field](form-field).',
    'Labelling a custom control while keeping the same styling as other labels.',
  ],
  whenNotToUse: [
    {
      text: 'A whole field with a hint and error message. Use a Form field, which includes the label.',
      alternative: 'form-field',
    },
  ],
  demos: [
    {
      id: 'label-required',
      title: 'Required and disabled',
      component: () => import('./demos/label-required.demo').then((m) => m.LabelRequiredDemo),
    },
  ],
  guidelines: {
    do: ['Keep labels short and visible at all times.', 'Put the label above the control.'],
    dont: [
      'Do not use a placeholder in place of a label.',
      'Do not use the required marker alone. Explain what required means if it is not obvious.',
    ],
  },
  a11y: {
    roles: [
      {
        element: 'label',
        role: '—',
        notes: 'Native label. The required mark is `aria-hidden="true"`.',
      },
    ],
    keyboard: [],
    notes: ['A label is not focusable. Clicking it moves focus to the linked control.'],
  },
  tokens: [
    '--mui-color-text',
    '--mui-color-text-muted',
    '--mui-font-weight-medium',
    '--mui-color-danger',
  ],
  related: ['form-field', 'input'],
};
