import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'skip-link',
  name: 'Skip link',
  group: 'navigation',
  selector: 'a[muiSkipLink]',
  apiClasses: ['SkipLink'],
  summary: 'A link that is hidden until focused and jumps keyboard users past the page header.',
  description: [
    'Skip link is applied to a native `<a href="#main">`. It is visually hidden until it receives focus, so place it as the first focusable element on the page.',
    'On activation it moves focus to the element the `href` names, and makes that element focusable if needed. It does this in code, so it also works when the page has a `<base href>`, where a plain `#main` link would leave the page. The text comes from the content you project, so it can be translated.',
  ],
  whenToUse: [
    'Any page with a header or navigation before the main content.',
    'Required for WCAG 2.4.1 (Bypass Blocks) when the page has repeated blocks.',
  ],
  whenNotToUse: [
    {
      text: 'Links between sections of the page content. Use a [Nav link](nav-link).',
      alternative: 'nav-link',
    },
  ],
  demos: [
    {
      id: 'skip-link-basic',
      title: 'Skip to content',
      component: () => import('./demos/skip-link-basic.demo').then((m) => m.SkipLinkBasicDemo),
    },
  ],
  guidelines: {
    do: ['Make it the first focusable element in the document.', 'Point it at `<main id="main">`.'],
    dont: ['Do not hide it with `display: none`: it must stay reachable by keyboard.'],
  },
  a11y: {
    roles: [{ element: 'a[muiSkipLink]', role: 'link (native)' }],
    keyboard: [
      { keys: 'Tab', action: 'Reveals the link when it is the first stop.' },
      { keys: 'Enter', action: 'Moves focus to the target.' },
    ],
    notes: ['The target gets `tabindex="-1"` when it is not focusable, so focus can land on it.'],
  },
  tokens: ['--mui-color-primary', '--mui-color-primary-text', '--mui-color-focus-ring'],
  related: ['site-header', 'nav-link'],
};
