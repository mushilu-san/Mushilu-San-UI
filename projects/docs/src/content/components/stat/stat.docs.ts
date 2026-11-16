import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'stat',
  name: 'Stat',
  group: 'data-display',
  selector: 'mui-stat, mui-stats',
  apiClasses: ['Stat', 'Stats'],
  summary: 'A large figure above a short label, grouped in a responsive list.',
  description: [
    'Stat shows one figure with a label. Wrap several in `mui-stats` to get list semantics and a layout that wraps on small screens.',
    'Pass the value already formatted, such as `1,200` or `98%`.',
  ],
  whenToUse: ['Headline numbers on a home page or dashboard.'],
  whenNotToUse: [{ text: 'A chart or a trend over time. Use a chart.', alternative: 'chart' }],
  demos: [
    {
      id: 'stat-basic',
      title: 'Totals',
      component: () => import('./demos/stat-basic.demo').then((m) => m.StatBasicDemo),
    },
  ],
  guidelines: {
    do: ['Keep labels short.', 'Format the value before passing it in.'],
    dont: ['Do not put long text in the value.'],
  },
  a11y: {
    roles: [
      { element: 'mui-stats', role: 'list', notes: 'Give it an `aria-label`.' },
      { element: 'mui-stat', role: 'listitem', notes: 'Reads as value then label.' },
    ],
    keyboard: [],
    notes: ['Not interactive, so it has no focus stops.'],
  },
  tokens: ['--mui-color-text', '--mui-color-text-muted', '--mui-font-size-3xl'],
  related: ['card', 'chart'],
};
