import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'scroll-area',
  name: 'Scroll area',
  group: 'layout',
  selector: 'mui-scroll-area',
  apiClasses: ['ScrollArea'],
  summary: 'A region with a styled scrollbar for content that is taller or wider than its box.',
  description: [
    'Scroll area clips its content and scrolls it inside a box with a themed scrollbar. Set `orientation` to `vertical`, `horizontal` or `both`.',
    'The region is not focusable by default. Add `tabindex="0"` to it when it has no focusable content, so keyboard users can scroll it with the arrow and page keys.',
  ],
  whenToUse: [
    'A long list or log inside a fixed-height panel.',
    'A wide table or code block that should not change the page width.',
  ],
  whenNotToUse: [{ text: 'The whole page. The browser scrolls it already.' }],
  demos: [
    {
      id: 'scroll-area-basic',
      title: 'Vertical list',
      component: () => import('./demos/scroll-area-basic.demo').then((m) => m.ScrollAreaBasicDemo),
    },
  ],
  guidelines: {
    do: [
      'Give the area a fixed height so it is clear it scrolls.',
      'Give the region a label when it contains a list the user needs to find.',
    ],
    dont: ['Do not nest scroll areas. Two scrollbars confuse users.'],
  },
  a11y: {
    roles: [
      {
        element: 'host',
        role: '—',
        notes: 'A scrollable wrapper. Add a label or heading so the purpose is clear.',
      },
    ],
    keyboard: [
      {
        keys: 'Arrow keys, PageUp / PageDown, Home / End',
        action: 'Scroll the region once it has focus.',
      },
    ],
    notes: [
      'Make sure the content is reachable by keyboard. Focusable items inside should scroll into view.',
    ],
  },
  tokens: ['--mui-color-border', '--mui-color-focus-ring', '--mui-radius-md'],
  related: ['resizable', 'table'],
};
