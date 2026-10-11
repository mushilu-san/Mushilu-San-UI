import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'calendar',
  name: 'Calendar',
  group: 'forms',
  selector: 'mui-calendar',
  apiClasses: ['Calendar'],
  summary: 'A month grid for picking a single date, with keyboard navigation.',
  description: [
    'Calendar shows one month at a time. The `value` model holds the selected `Date`, and `minDate` and `maxDate` disable days outside the range. `locale` controls month and weekday names.',
    'Arrow keys move the focused day, PageUp and PageDown move by month, and Home and End move to the start and end of the week. The month heading is announced politely when it changes.',
  ],
  whenToUse: [
    'Choosing a date where the user benefits from seeing the surrounding days.',
    'Booking or scheduling, where availability is shown by range.',
  ],
  whenNotToUse: [
    {
      text: 'Typing a date, or a date that is far in the past. Use a [Date picker](date-picker) with a text field.',
      alternative: 'date-picker',
    },
  ],
  demos: [
    {
      id: 'calendar-basic',
      title: 'Single date',
      component: () => import('./demos/calendar-basic.demo').then((m) => m.CalendarBasicDemo),
    },
  ],
  guidelines: {
    do: [
      'Set `minDate` and `maxDate` so impossible dates cannot be chosen.',
      'Show the selected date as text nearby too.',
    ],
    dont: [
      'Do not use a calendar for a date in the distant past or future where typing is faster.',
    ],
  },
  a11y: {
    roles: [
      {
        element: 'month heading',
        role: 'heading (level 2)',
        notes: '`aria-live="polite"`, so the new month is announced.',
      },
      {
        element: 'day',
        role: 'button',
        notes:
          '`aria-selected` on the chosen day and `aria-current="date"` on today. Unavailable days are `aria-disabled`.',
      },
    ],
    keyboard: [
      { keys: 'ArrowLeft / ArrowRight / ArrowUp / ArrowDown', action: 'Move the focused day.' },
      { keys: 'PageUp / PageDown', action: 'Move to the previous or next month.' },
      { keys: 'Home / End', action: 'Move to the start or end of the week.' },
      { keys: 'Enter / Space', action: 'Select the focused day.' },
    ],
    notes: ['Name the calendar with a visible heading or a label on the control that contains it.'],
  },
  tokens: [
    '--mui-color-primary',
    '--mui-color-surface',
    '--mui-color-text',
    '--mui-color-text-muted',
    '--mui-color-focus-ring',
    '--mui-touch-target',
  ],
  related: ['date-picker'],
};
