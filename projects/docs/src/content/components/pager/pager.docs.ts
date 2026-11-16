import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'pager',
  name: 'Pager',
  group: 'navigation',
  selector: 'mui-pager, a[muiPagerLink]',
  apiClasses: ['Pager', 'PagerLink'],
  summary: 'Previous and next links with direction labels that mirror in right-to-left.',
  description: [
    'Pager is a navigation landmark with up to two `a[muiPagerLink]` links. Add `href` or `routerLink` to the anchor yourself. The chevron mirrors in RTL and `rel` defaults to `prev` or `next`.',
  ],
  whenToUse: ['Moving between the parts of a series or the neighbours of an article.'],
  whenNotToUse: [{ text: 'Numbered pages of results. Use pagination.', alternative: 'pagination' }],
  demos: [
    {
      id: 'pager-basic',
      title: 'Previous and next',
      component: () => import('./demos/pager-basic.demo').then((m) => m.PagerBasicDemo),
    },
  ],
  guidelines: {
    do: ['Name the landmark with a translated `label`.'],
    dont: ['Do not use it for more than two links.'],
  },
  a11y: {
    roles: [
      { element: 'mui-pager', role: 'navigation', notes: 'Named by `label`.' },
      { element: 'a', role: 'link', notes: 'The chevron is `aria-hidden`.' },
    ],
    keyboard: [
      { keys: 'Tab / Shift+Tab', action: 'Moves between the links.' },
      { keys: 'Enter', action: 'Follows the link.' },
    ],
    notes: [],
  },
  tokens: ['--mui-color-border', '--mui-color-text-muted', '--mui-touch-target'],
  related: ['pagination', 'breadcrumb'],
};
