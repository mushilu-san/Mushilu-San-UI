import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'mobile-nav',
  name: 'Mobile navigation',
  group: 'mobile',
  selector: 'mui-mobile-nav',
  apiClasses: ['MobileNav', 'MobileNavItem'],
  summary: 'A fixed bottom bar of three to five destinations, with badges for new items.',
  description: [
    'Mobile nav is a `nav` landmark with `mui-mobile-nav-item` links. `activeItem` is a two-way model holding the `value` of the current item, which gets `aria-current="page"`.',
    '`badge` shows a count on an item.',
  ],
  whenToUse: [
    'The three to five main sections of a phone app.',
    'Sections a user switches between often.',
  ],
  whenNotToUse: [
    { text: 'More than five destinations. Use a sidebar or a menu.', alternative: 'sidebar' },
    { text: 'Sections of one page. Use tabs.', alternative: 'tabs' },
  ],
  demos: [
    {
      id: 'mobile-nav-basic',
      title: 'Bottom bar',
      component: () => import('./demos/mobile-nav-basic.demo').then((m) => m.MobileNavBasicDemo),
    },
  ],
  guidelines: {
    do: [
      'Pair every icon with a short text label.',
      'Show a badge only for items that need attention.',
    ],
    dont: ['Do not hide the bar when the user scrolls down.'],
  },
  a11y: {
    roles: [
      { element: 'host', role: 'navigation', notes: 'Labelled "Main navigation".' },
      {
        element: 'item',
        role: 'link',
        notes: '`aria-current="page"` on the active item. Badge counts are part of the name.',
      },
    ],
    keyboard: [
      { keys: 'Tab / Shift+Tab', action: 'Moves between the items.' },
      { keys: 'Enter / Space', action: 'Opens the focused item.' },
    ],
    notes: ['Each item needs a visible label. Icons alone are not enough.'],
  },
  tokens: [
    '--mui-color-surface-raised',
    '--mui-color-border',
    '--mui-color-primary',
    '--mui-color-danger',
    '--mui-touch-target',
  ],
  related: ['nav-link', 'sidebar'],
};
