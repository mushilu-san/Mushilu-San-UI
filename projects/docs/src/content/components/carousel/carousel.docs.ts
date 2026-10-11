import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'carousel',
  name: 'Carousel',
  group: 'data-display',
  selector: 'mui-carousel',
  apiClasses: [
    'Carousel',
    'CarouselContent',
    'CarouselItem',
    'CarouselPrev',
    'CarouselNext',
    'CarouselDots',
  ],
  summary: 'A set of slides shown one at a time, with previous and next controls and dots.',
  description: [
    'Carousel shows one slide at a time from `mui-carousel-content`. `active` is a two-way index of the visible slide, `loop` wraps from the last slide to the first, and `autoPlay` advances every N milliseconds.',
    'Previous, next and dot controls are optional parts. The region has `aria-roledescription="carousel"`.',
  ],
  whenToUse: [
    'Featured items or a hero banner with a few slides.',
    'A gallery where users flip through the same kind of content.',
  ],
  whenNotToUse: [
    { text: 'Content the user must see in full. Auto-advancing slides are easy to miss.' },
    { text: 'Many items to scan. Use a grid.', alternative: 'grid' },
  ],
  demos: [
    {
      id: 'carousel-basic',
      title: 'Slides',
      component: () => import('./demos/carousel-basic.demo').then((m) => m.CarouselBasicDemo),
    },
  ],
  guidelines: {
    do: [
      'Keep auto-play off unless the content is decorative, or give users a pause control.',
      'Give each slide a meaningful heading.',
    ],
    dont: ['Do not put the only copy of important information in a carousel.'],
  },
  a11y: {
    roles: [
      {
        element: 'host',
        role: 'region',
        notes: '`aria-roledescription="carousel"` and a `label` (default "Carousel").',
      },
      { element: 'slide', role: 'group', notes: '`aria-roledescription="slide"`.' },
      {
        element: 'dots',
        role: 'tablist',
        notes: 'Each dot is `aria-selected` for the visible slide.',
      },
    ],
    keyboard: [
      {
        keys: 'ArrowLeft / ArrowRight',
        action: 'Move to the previous or next slide (reversed in RTL).',
      },
      { keys: 'Tab / Shift+Tab', action: 'Moves between the previous, next and dot controls.' },
    ],
    notes: [
      'Avoid auto-play for content users need to read. If you use it, give users a way to pause.',
    ],
  },
  tokens: [
    '--mui-color-surface',
    '--mui-color-border',
    '--mui-color-primary',
    '--mui-color-focus-ring',
    '--mui-touch-target',
  ],
  related: ['card', 'grid'],
};
