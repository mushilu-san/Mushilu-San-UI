import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'breadcrumb',
  name: 'Breadcrumb',
  group: 'navigation',
  selector: 'mui-breadcrumb',
  apiClasses: ['Breadcrumb'],
  summary: 'Shows where the current page sits in a hierarchy, with links back to each level.',
  description: [
    'Breadcrumb renders a `<nav>` with an ordered list of `items`. Every item with an `href` is a link, and the last item is the current page with `aria-current="page"`.',
    'The separator is decorative and hidden from assistive technology. Change it with `separator`.',
  ],
  whenToUse: [
    'Pages several levels deep in a site or app, such as a product inside a category.',
    'Helping users move back up a hierarchy.',
  ],
  whenNotToUse: [
    { text: 'A flat site with one level. Use a heading.' },
    { text: 'Steps in a process. Use a stepper or tabs.', alternative: 'tabs' },
  ],
  demos: [
    {
      id: 'breadcrumb-basic',
      title: 'Hierarchy',
      component: () => import('./demos/breadcrumb-basic.demo').then((m) => m.BreadcrumbBasicDemo),
    },
  ],
  guidelines: {
    do: [
      'Keep labels short and match the page headings.',
      'Leave the current page as text, not a link.',
    ],
    dont: ['Do not use breadcrumbs as the only way to move around the app.'],
  },
  a11y: {
    roles: [
      { element: 'host', role: 'navigation', notes: 'Labelled "Breadcrumb".' },
      { element: 'current item', role: '—', notes: '`aria-current="page"`.' },
    ],
    keyboard: [{ keys: 'Tab / Shift+Tab', action: 'Moves focus through the links in order.' }],
    notes: ['The separator is decorative and does not need a label.'],
  },
  tokens: [
    '--mui-color-text-muted',
    '--mui-color-primary',
    '--mui-color-focus-ring',
    '--mui-font-size-sm',
  ],
  related: ['tabs'],
};
