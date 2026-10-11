import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'sidebar',
  name: 'Sidebar',
  group: 'layout',
  selector: 'mui-sidebar',
  apiClasses: ['Sidebar', 'SidebarSection', 'SidebarItem', 'SidebarTrigger'],
  summary: 'An app navigation column with sections, items and a collapse control.',
  description: [
    'Sidebar is a `role="navigation"` landmark. `expanded` is a two-way model, and `SidebarTrigger` toggles it. When collapsed, the sidebar shrinks to a narrow strip, so keep an icon on every item.',
    'Each item takes its text from `label`, and the text is shown only while the sidebar is expanded. Sections group related items under a label. The active item carries `aria-current="page"`, so the current page is announced.',
  ],
  whenToUse: [
    'Primary navigation for an app with many sections.',
    'A settings area with grouped links.',
  ],
  whenNotToUse: [
    { text: 'Two to five top-level sections. Use tabs or a nav link group.', alternative: 'tabs' },
  ],
  demos: [
    {
      id: 'sidebar-basic',
      title: 'Navigation',
      component: () => import('./demos/sidebar-basic.demo').then((m) => m.SidebarBasicDemo),
    },
  ],
  guidelines: {
    do: [
      'Use an icon and a label on every item, so collapsed items remain understandable.',
      'Mark the current page with `active`.',
    ],
    dont: ['Do not place more than one sidebar on the same page.'],
  },
  a11y: {
    roles: [
      {
        element: 'host',
        role: 'navigation',
        notes: '`aria-label` from `label`. Name it "Sidebar navigation" by default.',
      },
      {
        element: 'trigger',
        role: 'button',
        notes: '`aria-expanded` and a label that says "Collapse sidebar" or "Expand sidebar".',
      },
      {
        element: 'item',
        role: 'link or button (native)',
        notes: '`aria-current="page"` when `active`.',
      },
      {
        element: 'section label',
        role: '—',
        notes: 'Decorative (`aria-hidden`). Use a heading if the section must be announced.',
      },
    ],
    keyboard: [
      { keys: 'Tab / Shift+Tab', action: 'Moves focus through the trigger and the items.' },
      { keys: 'Enter / Space', action: 'Activates the focused item or trigger.' },
    ],
    notes: [
      'Keep the collapsed state visible. Do not hide the sidebar with `display: none` while it is still a navigation option.',
    ],
  },
  tokens: [
    '--mui-color-surface',
    '--mui-color-border',
    '--mui-color-primary-subtle',
    '--mui-color-focus-ring',
    '--mui-touch-target',
  ],
  related: ['nav-link', 'tabs'],
};
