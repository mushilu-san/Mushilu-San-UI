import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'avatar',
  name: 'Avatar',
  group: 'primitives',
  selector: 'mui-avatar',
  apiClasses: ['Avatar'],
  summary: 'Shows a user image, or their initials when no image is available.',
  description: [
    'Avatar renders an image when `src` is set and loads. If the image is missing or fails to load, it falls back to the initials of `name`.',
    'The host is the accessible element: it has `role="img"` and an `aria-label` taken from `label`, or from `name` when `label` is empty. The image and initials inside are hidden from assistive technology so the name is announced once.',
  ],
  whenToUse: [
    'Identifying a person or account in a list, header, comment or card.',
    'Showing a compact user marker next to a name.',
  ],
  whenNotToUse: [
    { text: 'Decorative pictures with no person behind them. Use a plain image.' },
    {
      text: 'Showing status on a user. Combine with a [Badge](badge) next to the avatar instead.',
      alternative: 'badge',
    },
  ],
  demos: [
    {
      id: 'avatar-fallback',
      title: 'Image and initials',
      description: 'Without a working `src`, the initials of `name` are shown.',
      component: () => import('./demos/avatar-fallback.demo').then((m) => m.AvatarFallbackDemo),
    },
    {
      id: 'avatar-sizes',
      title: 'Sizes and shapes',
      description: 'Use `square` for organisations or products, `circle` for people.',
      component: () => import('./demos/avatar-sizes.demo').then((m) => m.AvatarSizesDemo),
    },
  ],
  guidelines: {
    do: [
      'Pass `name` even when you also pass an image, so the fallback and the accessible name stay correct.',
      'Use `label` when the visible name is not the full name, for example "Account of Dana Levi".',
    ],
    dont: [
      'Do not pass untrusted or unvalidated image URLs. `src` is sanitised by Angular, but the URL source is still your responsibility.',
      'Do not use an avatar as the only way to identify a user in a dense table. Show the name as text too.',
    ],
  },
  a11y: {
    roles: [
      {
        element: 'host',
        role: 'img',
        notes: '`aria-label` comes from `label`, or from `name` when `label` is empty.',
      },
      {
        element: 'image and initials',
        role: '—',
        notes: 'Both are `aria-hidden="true"`, so the name is read once.',
      },
    ],
    keyboard: [],
    notes: [
      'An avatar is not focusable. If it links somewhere, wrap it in a link and give the link the accessible name.',
      'Set `label` when the visible text is an abbreviation or the name is not known.',
    ],
  },
  tokens: ['--mui-color-surface', '--mui-color-text', '--mui-radius-full'],
  related: ['badge'],
};
