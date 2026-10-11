import type { RegistryEntry } from './types';

export const REGISTRY: readonly RegistryEntry[] = [
  {
    slug: 'button',
    name: 'Button',
    group: 'primitives',
    summary: 'Triggers an action or navigation, with variants, sizes and a loading state.',
    load: () => import('./components/button/button.docs').then((m) => m.doc),
  },
  {
    slug: 'dialog',
    name: 'Dialog',
    group: 'feedback',
    summary: 'A modal window for focused tasks, built on the native <dialog> element.',
    load: () => import('./components/dialog/dialog.docs').then((m) => m.doc),
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    group: 'navigation',
    summary: 'Switches between related panels of content in the same view.',
    load: () => import('./components/tabs/tabs.docs').then((m) => m.doc),
  },
];

export function findEntry(
  slug: string,
  registry: readonly RegistryEntry[] = REGISTRY,
): RegistryEntry | undefined {
  return registry.find((e) => e.slug === slug);
}
