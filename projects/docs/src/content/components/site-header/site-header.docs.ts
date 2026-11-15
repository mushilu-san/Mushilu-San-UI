import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'site-header',
  name: 'Site header',
  group: 'navigation',
  selector: 'mui-site-header',
  apiClasses: ['SiteHeader'],
  summary: 'A page header whose navigation collapses behind a menu button on small screens.',
  description: [
    'Site header shows a brand, the main navigation and optional actions. Project the brand with `slot="brand"`, extra buttons such as a theme toggle with `slot="actions"`, and the links as default content.',
    'On screens narrower than 48rem the links hide behind a menu button with `aria-expanded` and `aria-controls`. Escape closes the menu and returns focus to the button, and following a link closes it. On wide screens the links are always inline, decided by CSS alone, so a prerendered page does not shift when it loads. Set `--mui-site-header-bg`, `--mui-site-header-max-width`, `--mui-site-header-padding-inline` and `--mui-site-header-min-height` on the element to match the header to your page column. Bind `[(open)]` to control the menu from outside, for example to close it on a router navigation.',
  ],
  whenToUse: [
    'The top of a content site or blog with a handful of links.',
    'A header that must work before hydration, on a prerendered page.',
  ],
  whenNotToUse: [
    {
      text: 'A header with dropdown panels of links. Use a [Navigation menu](navigation-menu).',
      alternative: 'navigation-menu',
    },
    {
      text: 'A fixed bottom bar for an app. Use [Mobile navigation](mobile-nav).',
      alternative: 'mobile-nav',
    },
  ],
  demos: [
    {
      id: 'site-header-basic',
      title: 'Header with navigation',
      component: () => import('./demos/site-header-basic.demo').then((m) => m.SiteHeaderBasicDemo),
    },
  ],
  guidelines: {
    do: [
      'Translate `menuLabel` and `navLabel` on non-English pages.',
      'Add a [Skip link](skip-link) before the header.',
    ],
    dont: ['Do not put more than about seven links in the header.'],
  },
  a11y: {
    roles: [
      { element: 'header', role: 'banner' },
      { element: 'nav', role: 'navigation', notes: 'Named by `navLabel`.' },
      {
        element: 'button',
        role: 'button',
        notes: '`aria-expanded`, `aria-controls` and a name from `menuLabel`.',
      },
    ],
    keyboard: [
      { keys: 'Enter / Space', action: 'Opens or closes the menu from the menu button.' },
      { keys: 'Escape', action: 'Closes the menu and returns focus to the menu button.' },
      { keys: 'Tab / Shift+Tab', action: 'Moves through the links.' },
    ],
    notes: ['The menu button is hidden on wide screens, where the links are always visible.'],
  },
  tokens: [
    '--mui-color-surface',
    '--mui-site-header-bg',
    '--mui-site-header-max-width',
    '--mui-site-header-padding-inline',
    '--mui-site-header-min-height',
    '--mui-color-border',
    '--mui-touch-target',
    '--mui-color-focus-ring',
  ],
  related: ['skip-link', 'navigation-menu', 'nav-link'],
};
