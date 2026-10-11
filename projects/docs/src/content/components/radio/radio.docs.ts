import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'radio',
  name: 'Radio',
  group: 'forms',
  selector: 'input[type=radio][muiRadio]',
  apiClasses: ['Radio'],
  summary: 'A native radio button for choosing exactly one option from a set.',
  description: [
    'Radio is applied to a native `<input type="radio">`. Radios that share a `name` form one group: only one can be checked, and the arrow keys move between them.',
    'Put the group in a `<fieldset>` with a `<legend>` so screen readers announce the question with each option.',
  ],
  whenToUse: [
    'Choosing one option from a short list, where all options should be visible.',
    'Choosing between two to five options that each need an explanation.',
  ],
  whenNotToUse: [
    { text: 'Choosing one option from a long list. Use a select.' },
    { text: 'Choosing several options. Use checkboxes.', alternative: 'checkbox' },
  ],
  demos: [
    {
      id: 'radio-group',
      title: 'Radio group',
      component: () => import('./demos/radio-group.demo').then((m) => m.RadioGroupDemo),
    },
    {
      id: 'radio-sizes',
      title: 'Sizes',
      component: () => import('./demos/radio-sizes.demo').then((m) => m.RadioSizesDemo),
    },
  ],
  guidelines: {
    do: [
      'Put a question in the legend of the fieldset.',
      'Pre-select a sensible default when there is one.',
    ],
    dont: [
      'Do not use a radio group with only one option.',
      'Do not use radios for a yes/no choice that needs to be remembered. Use a toggle or checkbox.',
    ],
  },
  a11y: {
    roles: [{ element: 'input[type=radio]', role: 'radio (native)' }],
    keyboard: [
      {
        keys: 'Tab / Shift+Tab',
        action: 'Moves focus into the group on the checked radio, then out of it.',
      },
      {
        keys: 'Arrow keys',
        action: 'Move the selection to the next or previous radio in the group.',
      },
      { keys: 'Space', action: 'Checks the focused radio.' },
    ],
    notes: ['Each radio needs a visible label. Group radios with `name` and a `fieldset`.'],
  },
  tokens: [
    '--mui-color-primary',
    '--mui-color-border',
    '--mui-color-focus-ring',
    '--mui-touch-target',
  ],
  related: ['checkbox', 'select'],
};
