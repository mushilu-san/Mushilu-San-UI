import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'date-picker',
  name: 'Date picker',
  group: 'forms',
  selector: 'mui-date-picker',
  apiClasses: ['DatePicker'],
  summary: 'A button that opens a calendar panel to choose a single date.',
  description: [
    'Date picker shows the chosen date in a trigger button. Pressing it opens a calendar in a `role="dialog"`. The `value` model is two-way bindable, and `minDate` and `maxDate` limit the choice.',
    'The trigger carries `aria-expanded` and `aria-haspopup="dialog"`. Escape closes the panel and returns focus to the trigger.',
  ],
  whenToUse: [
    'Choosing one date in a form where the calendar context helps.',
    'Setting a date field with a limited range, such as a booking date.',
  ],
  whenNotToUse: [
    {
      text: 'Dates that the user knows and types often, such as a birth date. A text input with a date type is faster.',
      alternative: 'input',
    },
    {
      text: 'Showing a calendar that is always visible. Use the calendar.',
      alternative: 'calendar',
    },
  ],
  demos: [
    {
      id: 'date-picker-basic',
      title: 'Pick a date',
      component: () => import('./demos/date-picker-basic.demo').then((m) => m.DatePickerBasicDemo),
    },
  ],
  guidelines: {
    do: [
      'Format the shown date for the user locale with `locale`.',
      'Give the field a label so the purpose is clear.',
    ],
    dont: ['Do not open the calendar automatically on page load.'],
  },
  a11y: {
    roles: [
      {
        element: 'trigger',
        role: 'button (with aria-haspopup="dialog")',
        notes: '`aria-expanded` follows the panel state.',
      },
      { element: 'panel', role: 'dialog', notes: 'Named "Date picker", `aria-modal="true"`.' },
    ],
    keyboard: [
      { keys: 'Enter / Space', action: 'Opens the panel on the trigger.' },
      { keys: 'Escape', action: 'Closes the panel and returns focus to the trigger.' },
      {
        keys: 'Arrow keys, PageUp / PageDown, Home / End',
        action: 'Move through the days, as in the calendar.',
      },
    ],
    notes: ['Label the trigger with the field name, for example "Start date: 12 March 2027".'],
  },
  tokens: ['--mui-color-surface', '--mui-color-border', '--mui-shadow-3', '--mui-color-focus-ring'],
  related: ['calendar', 'input'],
};
