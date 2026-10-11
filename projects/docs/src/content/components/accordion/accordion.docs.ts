import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'accordion',
  name: 'Accordion',
  group: 'data-display',
  selector: 'mui-accordion',
  apiClasses: ['AccordionGroup', 'AccordionItem'],
  summary: 'A stack of headings that each show or hide their own panel of content.',
  description: [
    'Accordion is a group of items. Each `mui-accordion-item` has a `heading` button that toggles its panel, with `aria-expanded` and `aria-controls` linking the two.',
    'By default one panel is open at a time. Set `multiple` on the group to let several stay open.',
  ],
  whenToUse: [
    'FAQs and long settings pages where users look for one topic at a time.',
    'Grouping related sections that a user may want to skip.',
  ],
  whenNotToUse: [
    { text: 'Content the user reads in full, in order. Show it on the page.' },
    { text: 'Switching between views. Use tabs.', alternative: 'tabs' },
  ],
  demos: [
    {
      id: 'accordion-faq',
      title: 'FAQ',
      component: () => import('./demos/accordion-faq.demo').then((m) => m.AccordionFaqDemo),
    },
  ],
  guidelines: {
    do: [
      'Write headings as questions or short topic names.',
      'Open the most common answer by default when there is one.',
    ],
    dont: ['Do not hide critical warnings inside a collapsed item.'],
  },
  a11y: {
    roles: [
      {
        element: 'trigger',
        role: 'button',
        notes:
          '`aria-expanded` follows the panel state, `aria-controls` names the panel. `aria-disabled` when disabled.',
      },
    ],
    keyboard: [
      { keys: 'Tab / Shift+Tab', action: 'Moves between the heading buttons.' },
      { keys: 'Enter / Space', action: 'Opens or closes the focused panel.' },
      { keys: 'ArrowDown / ArrowUp', action: 'Move focus to the next or previous heading.' },
    ],
    notes: [
      'The trigger is a native button, so Enter and Space work without extra code. Keep the heading text descriptive, since it is the only label.',
    ],
  },
  tokens: [
    '--mui-color-border',
    '--mui-color-text',
    '--mui-color-focus-ring',
    '--mui-touch-target',
    '--mui-space-3',
  ],
  related: ['tabs', 'card'],
};
