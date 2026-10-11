import type { Group } from './types';

export interface GroupInfo {
  id: Group;
  label: string;
  entry: string;
  description: string;
}

export const GROUPS: readonly GroupInfo[] = [
  {
    id: 'primitives',
    label: 'Primitives',
    entry: '@mushilu-san/ui/primitives',
    description: 'Buttons, icons, badges and other building blocks.',
  },
  {
    id: 'forms',
    label: 'Forms',
    entry: '@mushilu-san/ui/forms',
    description: 'Inputs and controls with ControlValueAccessor support.',
  },
  {
    id: 'layout',
    label: 'Layout',
    entry: '@mushilu-san/ui/layout',
    description: 'Containers, stacks, grids and app structure.',
  },
  {
    id: 'navigation',
    label: 'Navigation',
    entry: '@mushilu-san/ui/navigation',
    description: 'Tabs, breadcrumbs, menus and pagination.',
  },
  {
    id: 'feedback',
    label: 'Feedback',
    entry: '@mushilu-san/ui/feedback',
    description: 'Alerts, dialogs, sheets, toasts and progress.',
  },
  {
    id: 'data-display',
    label: 'Data display',
    entry: '@mushilu-san/ui/data-display',
    description: 'Cards, tables, charts and typography.',
  },
  {
    id: 'mobile',
    label: 'Mobile',
    entry: '@mushilu-san/ui/mobile',
    description: 'Touch-first patterns: bottom sheets, FABs, swipe actions.',
  },
  {
    id: 'overlays',
    label: 'Overlays',
    entry: '@mushilu-san/ui/overlays',
    description: 'Popovers, menus, command palette and combobox.',
  },
];

export function groupInfo(id: Group): GroupInfo {
  const info = GROUPS.find((g) => g.id === id);
  if (!info) throw new Error(`Unknown group "${id}"`);
  return info;
}
