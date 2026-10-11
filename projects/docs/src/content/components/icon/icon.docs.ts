import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'icon',
  name: 'Icon',
  group: 'primitives',
  selector: 'mui-icon',
  apiClasses: ['Icon'],
  summary: 'A set of built-in outline icons, sized and coloured with the surrounding text.',
  description: [
    'Icon draws an SVG from a fixed set of names. It uses `currentColor`, so it takes the colour of its parent unless `color` is set.',
    'An icon without a `label` is decorative and hidden from assistive technology. Set `label` when the icon carries meaning on its own, and the icon gets `role="img"`.',
  ],
  whenToUse: [
    'Supporting a text label, such as a mail icon next to an email address.',
    'Icon-only controls, where the icon is wrapped in a button that has its own accessible name.',
  ],
  whenNotToUse: [
    { text: 'A decorative picture or illustration. Use an image.' },
    { text: 'An icon with no text and no label. The meaning is lost for screen reader users.' },
  ],
  demos: [
    {
      id: 'icon-sizes',
      title: 'Sizes and colours',
      component: () => import('./demos/icon-sizes.demo').then((m) => m.IconSizesDemo),
    },
    {
      id: 'icon-label',
      title: 'Labelled and mirrored',
      description:
        'Directional icons such as arrows and chevrons use `mirror` so they point the right way in RTL.',
      component: () => import('./demos/icon-label.demo').then((m) => m.IconLabelDemo),
    },
  ],
  guidelines: {
    do: [
      'Use `mirror` for arrows and chevrons that indicate direction.',
      'Put a visible text label next to an icon whenever possible.',
    ],
    dont: [
      'Do not use `mirror` on icons that are not directional, such as a search or a star icon.',
      'Do not use `label` on an icon inside a button that already has a name. The name would be read twice.',
    ],
  },
  a11y: {
    roles: [
      { element: 'host, no label', role: '—', notes: '`aria-hidden="true"`.' },
      { element: 'host, with label', role: 'img', notes: '`aria-label` is set from `label`.' },
    ],
    keyboard: [],
    notes: [
      'An icon is not focusable. For an icon-only action, use a [Button](button) with an `aria-label` on the button.',
    ],
  },
  tokens: [
    '--mui-color-text',
    '--mui-color-primary',
    '--mui-color-danger',
    '--mui-color-success',
    '--mui-color-warning',
    '--mui-color-text-muted',
  ],
  related: ['button'],
};
