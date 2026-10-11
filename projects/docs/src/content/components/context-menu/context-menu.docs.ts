import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'context-menu',
  name: 'Context menu',
  group: 'overlays',
  selector: 'mui-context-menu',
  apiClasses: ['ContextMenu', 'ContextMenuTrigger', 'ContextMenuItem', 'ContextMenuSeparator'],
  summary:
    'A menu that opens at the pointer on right-click or long press, with actions for the area under it.',
  description: [
    'Context menu wraps an area marked with `muiContextMenuTrigger`. Right-click opens the menu at the pointer. On touch screens a long press does the same. `open` is a two-way model, and items are `mui-context-menu-item` entries.',
    'Escape closes the menu. Choosing an item closes it unless `closeOnSelect` is off.',
  ],
  whenToUse: [
    'Secondary actions on a file, row or canvas item, where the same actions also exist elsewhere.',
    'Power-user shortcuts in a document or editor.',
  ],
  whenNotToUse: [
    {
      text: 'The only way to reach an action. Keyboard and touch users may not find it.',
      alternative: 'dropdown-menu',
    },
    { text: 'Choosing a value. Use a select.', alternative: 'select' },
  ],
  demos: [
    {
      id: 'context-menu-file',
      title: 'File actions',
      component: () => import('./demos/context-menu-file.demo').then((m) => m.ContextMenuFileDemo),
    },
  ],
  guidelines: {
    do: [
      'Show the same actions in a visible control too, such as a "more" button.',
      'Mark destructive items with `color="danger"`.',
    ],
    dont: ['Do not rely on right-click as the only way to open a menu.'],
  },
  a11y: {
    roles: [
      { element: 'menu item', role: 'menuitem', notes: '`aria-disabled` when disabled.' },
      { element: 'separator', role: 'separator' },
    ],
    keyboard: [
      { keys: 'ArrowDown / ArrowUp, Home / End', action: 'Move between items.' },
      { keys: 'Escape', action: 'Closes the menu.' },
    ],
    notes: [
      'A context menu is a supplement. Always offer the same actions through a visible control.',
    ],
  },
  tokens: [
    '--mui-color-surface-raised',
    '--mui-color-border',
    '--mui-shadow-3',
    '--mui-color-danger',
    '--mui-color-focus-ring',
  ],
  related: ['dropdown-menu'],
};
