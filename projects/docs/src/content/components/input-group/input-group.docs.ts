import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'input-group',
  name: 'Input group',
  group: 'forms',
  selector: 'mui-input-group',
  apiClasses: ['InputGroup', 'InputGroupAddon'],
  summary: 'Joins an input with text or icon addons, such as a currency sign or a unit.',
  description: [
    'Input group wraps one `muiInput` and one or more `mui-input-group-addon` elements in a single bordered box. The addons sit visually attached to the input.',
    'The group shares its `size` and `invalid` state with the inputs inside it, so a single invalid state styles the whole box.',
  ],
  whenToUse: [
    'A value with a unit or currency, such as "$" or "kg".',
    'A URL or address with a fixed prefix.',
  ],
  whenNotToUse: [
    { text: 'Plain inputs with no fixed text around them. Use an input.', alternative: 'input' },
  ],
  demos: [
    {
      id: 'input-group-addons',
      title: 'Addons',
      component: () =>
        import('./demos/input-group-addons.demo').then((m) => m.InputGroupAddonsDemo),
    },
  ],
  guidelines: {
    do: [
      'Make the addon text meaningful, such as "USD".',
      'Keep addons short. One or two characters or a word.',
    ],
    dont: ['Do not put interactive controls in an addon. Use a button outside the group.'],
  },
  a11y: {
    roles: [
      {
        element: 'host',
        role: '—',
        notes:
          'The group is a visual wrapper with no role. The addon text is read as part of the input name.',
      },
    ],
    keyboard: [
      { keys: 'Tab / Shift+Tab', action: 'Moves focus to the input. Addons are not focusable.' },
    ],
    notes: [
      'Make the addon meaningful to screen reader users. Name the input for the unit, for example "Price in USD".',
    ],
  },
  tokens: [
    '--mui-color-surface',
    '--mui-color-border',
    '--mui-color-text-muted',
    '--mui-radius-md',
  ],
  related: ['input'],
};
