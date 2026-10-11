import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'resizable',
  name: 'Resizable',
  group: 'layout',
  selector: 'mui-resizable-panel-group',
  apiClasses: ['ResizablePanelGroup', 'ResizablePanel', 'ResizableHandle'],
  summary: 'Splits an area into panels that the user can resize by dragging a handle.',
  description: [
    'A panel group holds panels separated by handles. Each panel has `defaultSize`, `minSize` and `maxSize` as percentages of the group. `direction` sets whether the panels sit side by side or stacked.',
    'Each handle has `role="separator"` and is focusable. Its `aria-valuenow` is the size of the panel before it, in percent. The arrow keys move it in small steps, so resizing does not need a mouse.',
  ],
  whenToUse: [
    'A file tree next to an editor, or a list next to a detail view, where the user needs to choose the split.',
  ],
  whenNotToUse: [{ text: 'A fixed layout. Use a Grid or a Stack.', alternative: 'grid' }],
  demos: [
    {
      id: 'resizable-basic',
      title: 'Horizontal split',
      component: () => import('./demos/resizable-basic.demo').then((m) => m.ResizableBasicDemo),
    },
  ],
  guidelines: {
    do: [
      'Set `minSize` so a panel never collapses to something unusable.',
      'Use `withHandle` to show a visible grip on the separator.',
    ],
    dont: ['Do not nest resizable groups more than one level deep.'],
  },
  a11y: {
    roles: [
      {
        element: 'handle',
        role: 'separator',
        notes:
          '`aria-orientation` is the perpendicular of the group direction, as the separator line runs across it.',
      },
    ],
    keyboard: [
      {
        keys: 'ArrowLeft / ArrowRight (or Up / Down when vertical)',
        action: 'Move the handle by a small step. Horizontal arrows are reversed in RTL.',
      },
    ],
    notes: [
      'Give panels meaningful content so their sizes are understood. Do not hide key content by allowing it to shrink to zero.',
    ],
  },
  tokens: ['--mui-color-border', '--mui-color-focus-ring', '--mui-touch-target'],
  related: ['grid', 'scroll-area'],
};
