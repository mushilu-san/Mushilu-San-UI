import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'pagination',
  name: 'Pagination',
  group: 'navigation',
  selector: 'mui-pagination',
  apiClasses: ['Pagination'],
  summary: 'Moves through pages of results with previous, next and numbered controls.',
  description: [
    'Pagination renders a `role="navigation"` with previous and next buttons and page buttons. The current page is a two-way `page` model, and `totalPages` sets the range.',
    'Long ranges collapse to ellipses around the current page. `siblingCount` sets how many pages show on each side of it.',
  ],
  whenToUse: [
    'Lists of results split across pages, such as search results or a table of records.',
    'Any list where the user needs to jump to a page by number.',
  ],
  whenNotToUse: [
    { text: 'A short list that fits on one screen.' },
    { text: 'An endless feed. Use a "Load more" button.', alternative: 'button' },
  ],
  demos: [
    {
      id: 'pagination-basic',
      title: 'Ten pages',
      component: () => import('./demos/pagination-basic.demo').then((m) => m.PaginationBasicDemo),
    },
  ],
  guidelines: {
    do: [
      'Show the total result count near the list so users know how many pages there are.',
      'Keep the page the user is on in the URL when the list is shareable.',
    ],
    dont: ['Do not hide pagination when there is only one page. Disable the controls instead.'],
  },
  a11y: {
    roles: [
      {
        element: 'host',
        role: 'navigation',
        notes: '`aria-label` from `ariaLabel`, default "Pagination".',
      },
      {
        element: 'previous / next',
        role: 'button',
        notes: 'Labelled "Go to previous page" and "Go to next page". `aria-disabled` at the ends.',
      },
      {
        element: 'page',
        role: 'button',
        notes: 'Labelled "Page N". `aria-current="page"` on the current page.',
      },
    ],
    keyboard: [
      { keys: 'Tab / Shift+Tab', action: 'Moves between the page controls.' },
      { keys: 'Enter / Space', action: 'Goes to the focused page.' },
    ],
    notes: ['Ellipses are decorative and hidden from assistive technology.'],
  },
  tokens: [
    '--mui-color-primary',
    '--mui-color-primary-text',
    '--mui-color-border',
    '--mui-color-focus-ring',
    '--mui-touch-target',
  ],
  related: ['tabs', 'table'],
};
