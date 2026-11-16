import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'copy-button',
  name: 'Copy button',
  group: 'primitives',
  selector: 'mui-copy-button',
  apiClasses: ['CopyButton'],
  summary: 'Copies text to the clipboard and announces that it was copied.',
  description: [
    'Copy button writes `text`, or the text of a `source` element, to the clipboard. It shows a copied label for `resetDelay` milliseconds and announces it in a polite live region. Translate `label` and `copiedLabel`.',
  ],
  whenToUse: ['Code samples, tokens and links that people paste elsewhere.'],
  whenNotToUse: [{ text: 'A general action. Use a button.', alternative: 'button' }],
  demos: [
    {
      id: 'copy-button-basic',
      title: 'Copy text',
      component: () => import('./demos/copy-button-basic.demo').then((m) => m.CopyButtonBasicDemo),
    },
  ],
  guidelines: {
    do: ['Give `source` an element to copy imperative or non-Angular content.'],
    dont: ['Do not copy secrets to the clipboard without the user asking.'],
  },
  a11y: {
    roles: [
      { element: 'button', role: 'button', notes: 'Named by its label.' },
      { element: 'status', role: 'status', notes: 'Announces the copied label.' },
    ],
    keyboard: [{ keys: 'Enter / Space', action: 'Copies the text.' }],
    notes: ['Emits `failed` when the clipboard is unavailable.'],
  },
  tokens: ['--mui-color-border', '--mui-color-success-text', '--mui-touch-target'],
  related: ['button'],
};
