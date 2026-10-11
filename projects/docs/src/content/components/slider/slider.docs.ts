import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'slider',
  name: 'Slider',
  group: 'forms',
  selector: 'mui-slider',
  apiClasses: ['Slider'],
  summary: 'Picks a number inside a range by dragging a thumb or using the keyboard.',
  description: [
    'Slider exposes a `role="slider"` thumb with `aria-valuemin`, `aria-valuemax` and `aria-valuenow`. The value is a two-way `value` model, and `min`, `max` and `step` set the range.',
    'Arrow keys move by one step, PageUp and PageDown by a larger amount, and Home and End jump to the ends. In RTL the horizontal arrows are reversed.',
  ],
  whenToUse: [
    'Choosing a value in a range where the exact number matters less than the rough size, such as volume or price range.',
    'Adjusting a setting that the user can see change live.',
  ],
  whenNotToUse: [
    {
      text: 'An exact number that the user must type. Use an input with type number.',
      alternative: 'input',
    },
  ],
  demos: [
    {
      id: 'slider-basic',
      title: 'Range with a live value',
      component: () => import('./demos/slider-basic.demo').then((m) => m.SliderBasicDemo),
    },
  ],
  guidelines: {
    do: [
      'Show the current value next to the slider.',
      'Set a `step` that matches the precision the user needs.',
    ],
    dont: [
      'Do not use a slider when the user needs an exact value.',
      'Do not hide the thumb label in a way that removes the value for screen readers.',
    ],
  },
  a11y: {
    roles: [
      {
        element: 'thumb',
        role: 'slider',
        notes:
          'Carries `aria-valuemin`, `aria-valuemax` and `aria-valuenow`. `aria-disabled` when disabled.',
      },
    ],
    keyboard: [
      {
        keys: 'ArrowLeft / ArrowRight, ArrowUp / ArrowDown',
        action: 'Move one step. Horizontal arrows are reversed in RTL.',
      },
      { keys: 'PageUp / PageDown', action: 'Move by a larger increment.' },
      { keys: 'Home / End', action: 'Jump to the minimum and maximum.' },
    ],
    notes: ['Name the slider with the `label` input. It sets the accessible name of the thumb.'],
  },
  tokens: [
    '--mui-color-primary',
    '--mui-color-border',
    '--mui-color-focus-ring',
    '--mui-touch-target',
  ],
  related: ['input'],
};
