import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'menubar',
  name: 'Menubar',
  group: 'navigation',
  selector: 'mui-menubar',
  apiClasses: [
    'Menubar',
    'MenubarMenu',
    'MenubarTrigger',
    'MenubarContent',
    'MenubarItem',
    'MenubarSeparator',
  ],
  summary: 'A horizontal bar of menus, such as File, Edit and View, for desktop-style commands.',
  description: [
    'Menubar is a `role="menubar"`. Each `MenubarTrigger` opens a menu of `MenubarItem` commands. Arrow keys move between triggers and items, and Escape closes the open menu.',
    'Items are `role="menuitem"` and separators are `role="separator"`. Use `MenubarSeparator` to group related commands.',
  ],
  whenToUse: [
    'Desktop-style apps with many commands grouped by category.',
    'Editors and tools where users expect File, Edit and View menus.',
  ],
  whenNotToUse: [
    {
      text: 'Site navigation with links to pages. Use a navigation menu.',
      alternative: 'navigation-menu',
    },
    {
      text: 'A single menu of actions on one button. Use a dropdown menu.',
      alternative: 'dropdown-menu',
    },
  ],
  demos: [
    {
      id: 'menubar-basic',
      title: 'Application menus',
      component: () => import('./demos/menubar-basic.demo').then((m) => m.MenubarBasicDemo),
    },
  ],
  guidelines: {
    do: [
      'Keep the top-level titles to one word.',
      'Show keyboard shortcuts with the command when there is one.',
    ],
    dont: ['Do not use a menubar on mobile. Use a bottom navigation or a sheet.'],
  },
  a11y: {
    roles: [
      { element: 'host', role: 'menubar', notes: '`aria-label` from `label`, default "Menu bar".' },
      { element: 'trigger', role: 'menuitem', notes: '`aria-expanded` follows the menu state.' },
      { element: 'item', role: 'menuitem' },
      { element: 'separator', role: 'separator' },
    ],
    keyboard: [
      { keys: 'ArrowLeft / ArrowRight', action: 'Move between menu titles.' },
      { keys: 'ArrowDown / ArrowUp', action: 'Move between items in an open menu.' },
      { keys: 'Enter / Space', action: 'Activates the focused item.' },
      { keys: 'Escape', action: 'Closes the open menu.' },
    ],
    notes: ['Disabled items are skipped by the arrow keys.'],
  },
  tokens: [
    '--mui-color-surface-raised',
    '--mui-color-border',
    '--mui-color-focus-ring',
    '--mui-shadow-2',
  ],
  related: ['dropdown-menu', 'navigation-menu'],
};
