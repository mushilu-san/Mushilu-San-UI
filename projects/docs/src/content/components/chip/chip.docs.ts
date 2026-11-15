import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'chip',
  name: 'Chip',
  group: 'primitives',
  selector: 'a[muiChip], button[muiChip], mui-chip',
  apiClasses: ['Chip'],
  summary: 'A compact pill for tags and filters, as a link, a toggle button or a plain label.',
  description: [
    'Chip is applied to a native `<a>` or `<button>`, so it keeps the link or button role. It is 32px tall, with a 44px pointer target made from a pseudo-element, so a row of tags stays compact.',
    'Set `selected` to mark the current tag. On a link it adds `aria-current="page"`. On a button it adds `aria-pressed`, so bind it only when the chip is a toggle. Use `leading` for decorative text such as `#`. The `mui-chip` element is a non-interactive label.',
  ],
  whenToUse: [
    'A list of tags or categories, each linking to a filtered page.',
    'Filter toggles above a list.',
  ],
  whenNotToUse: [
    {
      text: 'A status label that is not interactive and carries meaning, such as "New". Use a [Badge](badge).',
      alternative: 'badge',
    },
    {
      text: 'The main action of a page. Use a [Button](button).',
      alternative: 'button',
    },
  ],
  demos: [
    {
      id: 'chip-tags',
      title: 'Tag links',
      component: () => import('./demos/chip-tags.demo').then((m) => m.ChipTagsDemo),
    },
    {
      id: 'chip-toggle',
      title: 'Toggle button',
      component: () => import('./demos/chip-toggle.demo').then((m) => m.ChipToggleDemo),
    },
  ],
  guidelines: {
    do: [
      'Wrap a list of link chips in a `<nav>` or `<ul>` with a label.',
      'Keep chip text short, one or two words.',
    ],
    dont: [
      'Do not bind `selected` on a button that is not a toggle: it announces a pressed state.',
    ],
  },
  a11y: {
    roles: [
      {
        element: 'a[muiChip]',
        role: 'link (native)',
        notes: '`aria-current="page"` when selected.',
      },
      {
        element: 'button[muiChip]',
        role: 'button (native)',
        notes: '`aria-pressed` when `selected` is bound.',
      },
    ],
    keyboard: [
      { keys: 'Tab / Shift+Tab', action: 'Moves focus between chips.' },
      { keys: 'Enter', action: 'Follows a link chip or presses a button chip.' },
      { keys: 'Space', action: 'Presses a button chip.' },
    ],
    notes: ['The `leading` text is hidden from screen readers.'],
  },
  tokens: [
    '--mui-color-border',
    '--mui-color-primary',
    '--mui-color-primary-text',
    '--mui-color-focus-ring',
  ],
  related: ['badge', 'nav-link'],
};
