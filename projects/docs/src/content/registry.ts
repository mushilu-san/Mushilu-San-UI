import type { RegistryEntry } from './types';

export const REGISTRY: readonly RegistryEntry[] = [
  {
    slug: 'button',
    name: 'Button',
    group: 'primitives',
    summary: 'Triggers an action or navigation, with variants, sizes and a loading state.',
    load: () => import('./components/button/button.docs').then((m) => m.doc),
  },
];

export function findEntry(
  slug: string,
  registry: readonly RegistryEntry[] = REGISTRY,
): RegistryEntry | undefined {
  return registry.find((e) => e.slug === slug);
}
