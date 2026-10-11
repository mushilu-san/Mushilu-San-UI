import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'card',
  name: 'Card',
  group: 'data-display',
  selector: 'mui-card',
  apiClasses: ['Card'],
  summary: 'A bordered surface that groups related content, optionally clickable as a whole.',
  description: [
    'Card is a container for a related set of content. `variant` sets the elevation: `flat`, `elevated` or `outlined`.',
    'Set `clickable` when the whole card is one action. The card then has `role="button"`, responds to Enter and Space, and emits `clicked`. Put only one action in a clickable card.',
  ],
  whenToUse: [
    'A product, article or profile preview in a grid or list.',
    'A group of related fields or facts that belong together.',
  ],
  whenNotToUse: [
    {
      text: 'A card with several links or buttons. Put them in a list, since a clickable card holds one action.',
    },
    {
      text: 'Plain text with no grouping. Use a Container or Typography.',
      alternative: 'typography',
    },
  ],
  demos: [
    {
      id: 'card-variants',
      title: 'Variants',
      component: () => import('./demos/card-variants.demo').then((m) => m.CardVariantsDemo),
    },
    {
      id: 'card-clickable',
      title: 'Clickable',
      component: () => import('./demos/card-clickable.demo').then((m) => m.CardClickableDemo),
    },
  ],
  guidelines: {
    do: ['Give a clickable card a heading inside it, so its name is clear.'],
    dont: ['Do not nest a clickable card inside another button or link.'],
  },
  a11y: {
    roles: [
      {
        element: 'host',
        role: '— (or button when clickable)',
        notes: 'Clickable cards get `role="button"` and are focusable.',
      },
    ],
    keyboard: [
      { keys: 'Tab / Shift+Tab', action: 'Moves focus to a clickable card.' },
      { keys: 'Enter / Space', action: 'Activates a clickable card.' },
    ],
    notes: [
      'The accessible name of a clickable card comes from its content, so keep a heading in the card.',
    ],
  },
  tokens: [
    '--mui-color-surface',
    '--mui-color-border',
    '--mui-shadow-2',
    '--mui-radius-md',
    '--mui-color-focus-ring',
  ],
  related: ['typography', 'accordion'],
};
