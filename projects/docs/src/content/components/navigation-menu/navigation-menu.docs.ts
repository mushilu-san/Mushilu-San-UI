import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'navigation-menu',
  name: 'Navigation menu',
  group: 'navigation',
  selector: 'mui-navigation-menu',
  apiClasses: [
    'NavigationMenu',
    'NavigationMenuItem',
    'NavigationMenuTrigger',
    'NavigationMenuContent',
    'NavigationMenuLink',
  ],
  summary: 'A site navigation bar where some items open a panel of links.',
  description: [
    'Navigation menu is a `role="navigation"` landmark. A trigger button opens its content panel, and each link in the panel is reachable by keyboard. Only one panel is open at a time.',
    'Triggers carry `aria-expanded`. Escape closes the open panel.',
  ],
  whenToUse: [
    'A site header with a few sections, where each section has several links.',
    'Mega-menu style navigation on desktop.',
  ],
  whenNotToUse: [
    {
      text: 'Actions that change the document, such as "Save". Use a menu.',
      alternative: 'dropdown-menu',
    },
    { text: 'A single list of links. Use nav links.', alternative: 'nav-link' },
  ],
  demos: [
    {
      id: 'navigation-menu-basic',
      title: 'Site header',
      component: () =>
        import('./demos/navigation-menu-basic.demo').then((m) => m.NavigationMenuBasicDemo),
    },
  ],
  guidelines: {
    do: [
      'Keep each panel to a short list of links.',
      'Label the navigation with what it is, such as "Main navigation".',
    ],
    dont: ['Do not put forms or large content inside a panel.'],
  },
  a11y: {
    roles: [
      {
        element: 'host',
        role: 'navigation',
        notes: '`aria-label` from `label`, default "Main navigation".',
      },
      { element: 'trigger', role: 'button', notes: '`aria-expanded` follows the panel state.' },
      { element: 'link', role: 'link (native)', notes: '`aria-current="page"` when `active`.' },
    ],
    keyboard: [
      { keys: 'Tab / Shift+Tab', action: 'Moves between triggers and the links of an open panel.' },
      { keys: 'Enter / Space', action: 'Opens or closes a panel on its trigger.' },
      { keys: 'Escape', action: 'Closes the open panel.' },
    ],
    notes: [
      'Links inside a panel stay reachable by keyboard. Do not hide them from assistive technology.',
    ],
  },
  tokens: [
    '--mui-color-surface-raised',
    '--mui-color-border',
    '--mui-shadow-2',
    '--mui-color-focus-ring',
  ],
  related: ['nav-link', 'menubar'],
};
