import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'button',
  name: 'Button',
  group: 'primitives',
  selector: 'button[muiButton], a[muiButton]',
  apiClasses: ['Button'],
  summary: 'Triggers an action or navigation, with variants, sizes and a loading state.',
  description: [
    'Button is applied as an attribute to a native `<button>` or `<a>`, so it keeps the native role, form submission and keyboard behaviour for free.',
    'Loading buttons stay in the tab order. Both disabled and loading buttons set `aria-disabled="true"` and swallow clicks. A disabled button is also taken out of the tab order (`tabindex="-1"`), while a loading one keeps focus so the state is announced.',
  ],
  whenToUse: [
    'Submitting a form or confirming a step.',
    'Triggering an in-page action, such as opening a [Dialog](dialog).',
    'A call to action that navigates. Apply `muiButton` to an `<a>` so it is still a link.',
  ],
  whenNotToUse: [
    { text: 'Switching between views of related content.', alternative: 'tabs' },
    { text: 'Inline navigation inside a sentence. Use a plain link.' },
  ],
  demos: [
    {
      id: 'button-variants',
      title: 'Variants',
      component: () => import('./demos/button-variants.demo').then((m) => m.ButtonVariantsDemo),
    },
    {
      id: 'button-sizes',
      title: 'Sizes',
      description: 'Every size keeps a 44px minimum touch target.',
      component: () => import('./demos/button-sizes.demo').then((m) => m.ButtonSizesDemo),
    },
    {
      id: 'button-loading',
      title: 'Loading and disabled',
      description: 'While `loading` is set the button sets `aria-busy` and ignores clicks.',
      component: () => import('./demos/button-loading.demo').then((m) => m.ButtonLoadingDemo),
    },
    {
      id: 'button-link',
      title: 'As a link',
      description: 'Use `<a muiButton>` when the action navigates.',
      component: () => import('./demos/button-link.demo').then((m) => m.ButtonLinkDemo),
    },
  ],
  guidelines: {
    do: [
      'Use one `primary` button per view for the main action.',
      'Write labels as verbs that describe the outcome: "Save changes", not "OK".',
      'Use `destructive` for actions that delete or cannot be undone, and confirm them.',
      'Use `loading` for in-flight actions rather than disabling the button, so focus is not lost.',
    ],
    dont: [
      'Do not put a `muiButton` on a `<div>` or `<span>`.',
      'Do not rely on colour alone to distinguish destructive actions. Say it in the label.',
      'Do not use a disabled button as the only explanation for why an action is unavailable. Tell the user why.',
    ],
  },
  a11y: {
    roles: [
      { element: 'button[muiButton]', role: 'button (native)' },
      { element: 'a[muiButton]', role: 'link (native)' },
      {
        element: 'host',
        role: '—',
        notes:
          '`aria-disabled="true"` when disabled or loading; `aria-busy="true"` while loading; `tabindex="-1"` when disabled.',
      },
    ],
    keyboard: [
      {
        keys: 'Tab / Shift+Tab',
        action:
          'Moves focus to and from the button. Disabled buttons are skipped; loading buttons are not.',
      },
      {
        keys: 'Enter / Space',
        action: 'Activates the button. Default action is prevented while disabled or loading.',
      },
    ],
    notes: [
      'Icon-only buttons need an `aria-label` that describes the action.',
      'The loading spinner is decorative (`aria-hidden`). Change the label text if the state matters.',
    ],
  },
  tokens: [
    '--mui-color-primary',
    '--mui-color-primary-hover',
    '--mui-color-primary-active',
    '--mui-color-danger',
    '--mui-color-danger-hover',
    '--mui-radius-md',
    '--mui-touch-target',
    '--mui-color-focus-ring',
  ],
  related: ['dialog'],
};
