import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'dropdown-menu',
  name: 'Dropdown menu',
  group: 'overlays',
  selector: 'mui-dropdown-menu',
  apiClasses: ['DropdownMenu', 'DropdownTrigger', 'DropdownItem', 'DropdownSeparator'],
  summary: 'A button that opens a menu of actions for the item or page around it.',
  description: [
    'Dropdown menu wraps a `muiDropdownTrigger` button and a list of `mui-dropdown-item` actions. `open` is a two-way model. Items are `role="menuitem"`, and `color="danger"` marks a destructive action.',
    'Arrow keys, Home and End move between enabled items. Escape closes the menu and returns focus to the trigger. Tab closes it. Choosing an item closes the menu unless `closeOnSelect` is off.',
  ],
  whenToUse: [
    'A set of actions for one item, such as Edit, Duplicate and Delete for a row.',
    'A toolbar overflow with secondary commands.',
  ],
  whenNotToUse: [
    { text: 'Choosing a value that sets a field. Use a select.', alternative: 'select' },
    { text: 'Site navigation with pages. Use a navigation menu.', alternative: 'navigation-menu' },
  ],
  demos: [
    {
      id: 'dropdown-menu-actions',
      title: 'Actions',
      component: () =>
        import('./demos/dropdown-menu-actions.demo').then((m) => m.DropdownMenuActionsDemo),
    },
  ],
  guidelines: {
    do: [
      'Keep actions as verbs, such as "Duplicate".',
      'Put destructive actions last, separated and in the danger colour.',
    ],
    dont: [
      'Do not nest menus inside menus.',
      'Do not use a menu for a single action. Use a button.',
    ],
  },
  a11y: {
    roles: [
      { element: 'trigger', role: 'button', notes: '`aria-expanded` follows the menu state.' },
      { element: 'menu item', role: 'menuitem', notes: '`aria-disabled` when disabled.' },
      { element: 'separator', role: 'separator' },
    ],
    keyboard: [
      { keys: 'Enter / Space / ArrowDown', action: 'Opens the menu on the trigger.' },
      { keys: 'ArrowDown / ArrowUp', action: 'Move between enabled items (roving focus).' },
      { keys: 'Home / End', action: 'Move to the first or last enabled item.' },
      { keys: 'Escape', action: 'Closes the menu and returns focus to the trigger.' },
      { keys: 'Tab', action: 'Closes the menu.' },
    ],
    notes: ['Disabled items are skipped by the arrow keys.'],
  },
  tokens: [
    '--mui-color-surface-raised',
    '--mui-color-border',
    '--mui-shadow-3',
    '--mui-color-danger',
    '--mui-color-focus-ring',
  ],
  related: ['context-menu', 'menubar'],
};
