import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'aspect-ratio',
  name: 'Aspect ratio',
  group: 'layout',
  selector: 'mui-aspect-ratio',
  apiClasses: ['AspectRatio'],
  summary: 'Keeps its content at a fixed width-to-height ratio, such as 16:9 for video.',
  description: [
    'Aspect ratio sizes its box from the width and keeps the ratio as the width changes. The `ratio` input is width divided by height, so `16 / 9` is the default.',
    'The content is stretched to fill the box, so use it for images, video and embeds.',
  ],
  whenToUse: [
    'Keeping a video, image or map at a fixed shape while the layout width changes.',
    'Reserving space for media so the page does not shift when it loads.',
  ],
  whenNotToUse: [{ text: 'Text content with an unknown height. Let it size itself.' }],
  demos: [
    {
      id: 'aspect-ratio-basic',
      title: 'Ratios',
      component: () =>
        import('./demos/aspect-ratio-basic.demo').then((m) => m.AspectRatioBasicDemo),
    },
  ],
  guidelines: {
    do: ['Give images a meaningful `alt` text when they are content.'],
    dont: ['Do not use it to force text into a shape. Text can overflow the box.'],
  },
  a11y: {
    roles: [
      {
        element: 'host',
        role: '—',
        notes: 'A layout wrapper with no role. Accessibility comes from the content inside.',
      },
    ],
    keyboard: [],
    notes: [
      'Make sure the content inside is accessible, such as an image with `alt` or a video with captions.',
    ],
  },
  tokens: ['--mui-radius-md'],
  related: ['container'],
};
