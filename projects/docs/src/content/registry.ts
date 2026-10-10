import type { RegistryEntry } from './types';

export const REGISTRY: readonly RegistryEntry[] = [];

export function findEntry(
  slug: string,
  registry: readonly RegistryEntry[] = REGISTRY,
): RegistryEntry | undefined {
  return registry.find((e) => e.slug === slug);
}
