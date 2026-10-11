import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'nav-link',
  name: 'Nav link',
  group: 'navigation',
  selector: 'a[muiNavLink]',
  apiClasses: ['NavLink'],
  summary: 'A styled link for navigation bars, with an active state for the current page.',
  description: [
    'Nav link is applied to a native `<a>`, so it keeps the link role and keyboard behaviour. Set `active` for the current page, which adds `aria-current="page"`.',
    'Use `variant` to make the link look like plain text or a highlighted primary link, and `size` to fit the bar.',
  ],
  whenToUse: [
    'Links in a top bar or footer that should look like navigation.',
    'Showing which section of the site is open.',
  ],
  whenNotToUse: [
    {
      text: 'A call to action that performs an action. Use a [Button](button).',
      alternative: 'button',
    },
  ],
  demos: [
    {
      id: 'nav-link-bar',
      title: 'Navigation bar',
      component: () => import('./demos/nav-link-bar.demo').then((m) => m.NavLinkBarDemo),
    },
  ],
  guidelines: {
    do: [
      'Mark the current page with `active`.',
      'Keep the list of links short, about five to seven.',
    ],
    dont: ['Do not use a nav link for an action such as "Log out". Use a button.'],
  },
  a11y: {
    roles: [
      {
        element: 'a[muiNavLink]',
        role: 'link (native)',
        notes: '`aria-current="page"` when `active`.',
      },
    ],
    keyboard: [
      { keys: 'Tab / Shift+Tab', action: 'Moves focus between the links.' },
      { keys: 'Enter', action: 'Follows the link.' },
    ],
    notes: ['Wrap the links in a `<nav>` with a label, such as the `mui-navigation-menu` does.'],
  },
  tokens: [
    '--mui-color-text',
    '--mui-color-primary',
    '--mui-color-focus-ring',
    '--mui-touch-target',
  ],
  related: ['navigation-menu', 'sidebar'],
};
