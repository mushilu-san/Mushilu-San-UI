import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'command',
  name: 'Command',
  group: 'overlays',
  selector: 'mui-command',
  apiClasses: [
    'Command',
    'CommandInput',
    'CommandList',
    'CommandGroup',
    'CommandItem',
    'CommandEmpty',
    'CommandSeparator',
  ],
  summary: 'A searchable list of commands and pages, the building block for a command palette.',
  description: [
    'Command holds a search input and a `role="listbox"` of groups and items. `search` is a two-way model with the query. Each `mui-command-item` has a `value`, and choosing one emits `itemActivated`.',
    'Use `CommandEmpty` for the message shown when nothing matches. `shortcut` shows the keys for an item.',
  ],
  whenToUse: [
    'A command palette that opens with Cmd+K and lists actions and pages.',
    'A large set of commands that users search by name.',
  ],
  whenNotToUse: [
    { text: 'Picking a value for a form field. Use a combobox.', alternative: 'combobox' },
    {
      text: 'A short menu of actions for one item. Use a dropdown menu.',
      alternative: 'dropdown-menu',
    },
  ],
  demos: [
    {
      id: 'command-palette',
      title: 'Palette',
      component: () => import('./demos/command-palette.demo').then((m) => m.CommandPaletteDemo),
    },
  ],
  guidelines: {
    do: [
      'Group items by type, such as "Pages" and "Actions".',
      'Show a shortcut next to commands that have one.',
    ],
    dont: ['Do not put every setting in the palette. Keep the common ones.'],
  },
  a11y: {
    roles: [
      {
        element: 'list',
        role: 'listbox',
        notes: 'Options are `role="option"` with `aria-selected` on the highlighted one.',
      },
      { element: 'group', role: 'group', notes: 'Named by `label`.' },
      { element: 'empty message', role: 'status', notes: 'Announced when no item matches.' },
    ],
    keyboard: [
      { keys: 'Type', action: 'Filters the items.' },
      { keys: 'ArrowDown / ArrowUp', action: 'Move the highlight through the items.' },
      { keys: 'Enter', action: 'Runs the highlighted item.' },
    ],
    notes: ['Put focus in the search input when the palette opens, so typing works at once.'],
  },
  tokens: [
    '--mui-color-surface-raised',
    '--mui-color-border',
    '--mui-color-primary-subtle',
    '--mui-shadow-4',
    '--mui-color-focus-ring',
  ],
  related: ['combobox', 'dropdown-menu'],
};
