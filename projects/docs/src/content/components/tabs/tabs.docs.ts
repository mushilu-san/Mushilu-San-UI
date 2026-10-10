import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'tabs',
  name: 'Tabs',
  group: 'navigation',
  selector: 'mui-tabs',
  apiClasses: ['Tabs', 'TabList', 'Tab', 'TabPanel'],
  summary: 'Switches between related panels of content in the same view.',
  description: [
    'Tabs is a compound component. `mui-tabs` holds the active value, `mui-tab-list` holds the `mui-tab` triggers, and each `mui-tab-panel` shows when its `value` matches.',
    'The active tab is a two-way `activeTab` model, so you can bind it with `[(activeTab)]` to sync it with the URL or other state.',
  ],
  whenToUse: [
    'Grouping related content that users switch between without leaving the page.',
    'Settings or detail screens with a few peer sections.',
  ],
  whenNotToUse: [
    { text: 'Triggering an action. Tabs only switch views.', alternative: 'button' },
    { text: 'Sequential steps that must be done in order. Use a stepper or a multi-step form.' },
    { text: 'More than about six sections. Use a sidebar or a menu.' },
  ],
  demos: [
    {
      id: 'tabs-basic',
      title: 'Basic',
      component: () => import('./demos/tabs-basic.demo').then((m) => m.TabsBasicDemo),
    },
    {
      id: 'tabs-vertical',
      title: 'Vertical',
      description: 'With `orientation="vertical"`, Up and Down arrows move between tabs.',
      component: () => import('./demos/tabs-vertical.demo').then((m) => m.TabsVerticalDemo),
    },
    {
      id: 'tabs-disabled',
      title: 'Disabled tab',
      description: 'Disabled tabs are skipped by arrow-key navigation and cannot be activated.',
      component: () => import('./demos/tabs-disabled.demo').then((m) => m.TabsDisabledDemo),
    },
  ],
  guidelines: {
    do: [
      'Give every `mui-tab-list` an `aria-label` that names the group.',
      'Keep tab labels short, one or two words.',
      'Use `value`s that are unique on the page. Tab ids are derived from them.',
    ],
    dont: [
      'Do not nest tabs inside tabs.',
      'Do not put the only path to critical content behind a disabled tab without explaining why.',
    ],
  },
  a11y: {
    roles: [
      {
        element: 'mui-tab-list',
        role: 'tablist',
        notes: '`aria-orientation` follows the `orientation` input.',
      },
      {
        element: 'mui-tab',
        role: 'tab',
        notes: '`aria-selected`, `aria-controls`; `aria-disabled` when disabled.',
      },
      { element: 'mui-tab-panel', role: 'tabpanel', notes: '`aria-labelledby` points at its tab.' },
    ],
    keyboard: [
      {
        keys: 'ArrowLeft / ArrowRight',
        action: 'Moves focus between tabs (horizontal). Wraps at the ends.',
      },
      { keys: 'ArrowUp / ArrowDown', action: 'Moves focus between tabs (vertical).' },
      { keys: 'Home / End', action: 'Moves focus to the first or last enabled tab.' },
      { keys: 'Enter / Space', action: 'Activates the focused tab.' },
    ],
    notes: [
      'Activation is manual. Arrow keys move focus, and Enter or Space selects. This avoids loading panels the user is only passing over.',
      'Only the active tab is in the tab order (roving `tabindex`). Always set an initial `activeTab`; with the default empty value no tab is focusable.',
      'Inactive panels are `hidden` and their content is not rendered. The active panel is itself focusable (`tabindex="0"`).',
    ],
  },
  tokens: [
    '--mui-color-primary',
    '--mui-color-border',
    '--mui-color-text',
    '--mui-color-text-muted',
    '--mui-color-text-disabled',
    '--mui-color-focus-ring',
    '--mui-touch-target',
  ],
  related: ['button'],
};
