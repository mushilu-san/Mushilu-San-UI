import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'form-field',
  name: 'Form field',
  group: 'forms',
  selector: 'mui-form-field',
  apiClasses: ['FormField'],
  summary: 'Wraps one control with its label, hint text and error message.',
  description: [
    'Form field renders the label, the projected control, an optional hint and an optional error. The label is linked to the control with `controlId`, so give the control the same `id`.',
    'The error message has `role="alert"`, so it is announced as soon as it appears. Show it only after the user has interacted with the field.',
  ],
  whenToUse: [
    'Every standalone input, select or textarea that needs a label and a message.',
    'Forms where the same label, hint and error layout should repeat.',
  ],
  whenNotToUse: [
    {
      text: 'A control that already has a visible label from its parent, such as a checkbox inside a sentence.',
    },
  ],
  demos: [
    {
      id: 'form-field-error',
      title: 'Hint and error',
      component: () => import('./demos/form-field-error.demo').then((m) => m.FormFieldErrorDemo),
    },
  ],
  guidelines: {
    do: [
      'Write the error so it says how to fix the problem.',
      'Use the hint for format rules, such as "8 characters or more".',
    ],
    dont: [
      'Do not show an error before the user has typed anything.',
      'Do not set `error` for a warning. Use a hint.',
    ],
  },
  a11y: {
    roles: [
      { element: 'label', role: '—', notes: 'Linked to the control with `for`.' },
      { element: 'error', role: 'alert', notes: 'Announced when it appears.' },
    ],
    keyboard: [],
    notes: [
      'Set `required` on the control, not only the marker, so the requirement is announced.',
      'Connect the control to the hint and error with `aria-describedby` when the form field does not do it for you.',
    ],
  },
  tokens: ['--mui-space-1', '--mui-space-2', '--mui-color-text-muted', '--mui-color-danger'],
  related: ['label', 'input'],
};
