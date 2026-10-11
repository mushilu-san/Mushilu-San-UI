import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'chart',
  name: 'Chart',
  group: 'data-display',
  selector: 'mui-chart',
  apiClasses: ['Chart'],
  summary: 'A bar, line, pie or doughnut chart drawn from a data set, with an accessible name.',
  description: [
    'Chart draws its data on a canvas, using the data format of Chart.js. `type` picks the chart kind, and `data` and `options` are passed through to it.',
    'The chart is a `role="figure"` named by `label`. The drawing itself is not readable by screen readers, so show the key numbers in text or a table next to it.',
  ],
  whenToUse: [
    'Showing a trend or a comparison across a few categories or dates.',
    'A summary view where the shape of the data matters more than exact values.',
  ],
  whenNotToUse: [
    { text: 'Exact values that users need to read or compare. Use a table.', alternative: 'table' },
  ],
  demos: [
    {
      id: 'chart-bar',
      title: 'Bar chart',
      component: () => import('./demos/chart-bar.demo').then((m) => m.ChartBarDemo),
    },
  ],
  guidelines: {
    do: [
      'Give every chart a `label` that says what it shows and the period.',
      'Use colour plus a legend or labels, not colour alone.',
    ],
    dont: [
      'Do not use a pie chart for more than about five slices.',
      'Do not truncate the value axis of a bar chart.',
    ],
  },
  a11y: {
    roles: [{ element: 'host', role: 'figure', notes: '`aria-label` from `label`.' }],
    keyboard: [],
    notes: ['Provide the same numbers in a table or text summary below the chart.'],
  },
  tokens: [
    '--mui-color-primary',
    '--mui-color-success',
    '--mui-color-warning',
    '--mui-color-danger',
    '--mui-color-text-muted',
  ],
  related: ['table'],
};
