import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'hover-card',
  name: 'Hover card',
  group: 'overlays',
  selector: 'mui-hover-card',
  apiClasses: ['HoverCard', 'HoverCardTrigger', 'HoverCardContent'],
  summary: 'A preview card that appears after a short hover over a link or name.',
  description: [
    'Hover card shows a `mui-hover-card-content` preview when the pointer rests on a `muiHoverCardTrigger`. `openDelay` and `closeDelay` set how long to wait, in milliseconds, so the card does not flicker.',
    'The content has `role="tooltip"`, and the trigger is linked to it while it is open. It is for a preview; the trigger is still a normal link.',
  ],
  whenToUse: [
    'A quick preview of a person, page or item behind a link.',
    'Extra context that a user may want, but does not need to read.',
  ],
  whenNotToUse: [
    {
      text: 'Content the user must read or act on. A hover card is not reachable on touch.',
      alternative: 'popover',
    },
    { text: 'A one-line hint. Use a tooltip.', alternative: 'tooltip' },
  ],
  demos: [
    {
      id: 'hover-card-profile',
      title: 'Profile preview',
      component: () =>
        import('./demos/hover-card-profile.demo').then((m) => m.HoverCardProfileDemo),
    },
  ],
  guidelines: {
    do: [
      'Keep the trigger a real link, so the page works without the preview.',
      'Put the same information on the linked page.',
    ],
    dont: ['Do not put forms or buttons inside a hover card.'],
  },
  a11y: {
    roles: [
      { element: 'content', role: 'tooltip', notes: 'Linked from the trigger while it is open.' },
      { element: 'trigger', role: '—', notes: 'Keeps its own role, such as link.' },
    ],
    keyboard: [
      { keys: 'Focus', action: 'Shows the card on the focused trigger.' },
      { keys: 'Escape', action: 'Hides the card.' },
    ],
    notes: [
      'Hover cards are not reachable by touch. The linked page must hold the same information.',
    ],
  },
  tokens: ['--mui-color-surface-raised', '--mui-color-border', '--mui-shadow-3', '--mui-radius-md'],
  related: ['popover', 'tooltip'],
};
