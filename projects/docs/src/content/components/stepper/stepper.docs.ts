import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'stepper',
  name: 'Stepper',
  group: 'data-display',
  selector: 'mui-stepper, mui-step',
  apiClasses: ['Stepper', 'Step'],
  summary: 'An ordered list of numbered steps, with optional links and meta text.',
  description: [
    'Stepper shows an ordered list of numbered steps. Numbers are automatic; set `number` on a step to override. A step with `href` turns its label into a link stretched over the whole step.',
  ],
  whenToUse: ['A series of parts, a how-to, or onboarding steps.'],
  whenNotToUse: [
    { text: 'Tabs or sections that are not a sequence. Use tabs.', alternative: 'tabs' },
  ],
  demos: [
    {
      id: 'stepper-basic',
      title: 'A numbered list',
      component: () => import('./demos/stepper-basic.demo').then((m) => m.StepperBasicDemo),
    },
  ],
  guidelines: {
    do: ['Keep labels short and put detail in the description.'],
    dont: ['Do not nest interactive controls inside a step that has a link.'],
  },
  a11y: {
    roles: [
      { element: 'mui-stepper', role: 'list', notes: 'Give it an `aria-label`.' },
      { element: 'mui-step', role: 'listitem', notes: 'The number marker is decorative.' },
    ],
    keyboard: [{ keys: 'Tab / Shift+Tab', action: 'Moves between step links.' }],
    notes: ['The link target covers the whole step.'],
  },
  tokens: ['--mui-color-primary', '--mui-color-primary-text', '--mui-space-3'],
  related: ['tabs', 'accordion'],
};
