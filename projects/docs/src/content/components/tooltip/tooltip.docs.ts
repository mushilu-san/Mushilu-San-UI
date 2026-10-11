import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'tooltip',
  name: 'Tooltip',
  group: 'data-display',
  selector: '[muiTooltip]',
  apiClasses: ['Tooltip'],
  summary: 'A short hint that appears when the user hovers or focuses an element.',
  description: [
    'Add `muiTooltip` to any element to show its text on hover and on keyboard focus. `placement` sets the side. The tooltip has `role="tooltip"`, and the trigger points to it with `aria-describedby` while it is visible.',
    'Escape hides the tooltip. The tooltip is a description, not the name, so the trigger still needs its own accessible name.',
  ],
  whenToUse: [
    'Explaining an icon-only button, such as "Copy link".',
    'A short clarification of a label or value.',
  ],
  whenNotToUse: [
    { text: 'Essential information. Users on touch devices may never see it.' },
    { text: 'Interactive content such as links or forms. Use a popover.', alternative: 'popover' },
  ],
  demos: [
    {
      id: 'tooltip-placement',
      title: 'Placement',
      component: () => import('./demos/tooltip-placement.demo').then((m) => m.TooltipPlacementDemo),
    },
  ],
  guidelines: {
    do: [
      'Keep the text to a few words.',
      'Give the trigger a visible label or an aria-label as well.',
    ],
    dont: [
      'Do not put a button or link inside a tooltip.',
      'Do not hide the only explanation of a control in a tooltip.',
    ],
  },
  a11y: {
    roles: [
      {
        element: 'tooltip',
        role: 'tooltip',
        notes: 'Linked from the trigger with `aria-describedby` while visible.',
      },
    ],
    keyboard: [
      { keys: 'Focus', action: 'Shows the tooltip on the focused trigger.' },
      { keys: 'Escape', action: 'Hides the tooltip.' },
    ],
    notes: [
      'Icon-only triggers still need `aria-label`. The tooltip adds a description, not a name.',
    ],
  },
  tokens: [
    '--mui-color-text',
    '--mui-color-surface-raised',
    '--mui-shadow-3',
    '--mui-radius-sm',
    '--mui-font-size-xs',
  ],
  related: ['popover', 'icon'],
};
