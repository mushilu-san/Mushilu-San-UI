import { InjectionToken } from '@angular/core';
import { REGISTRY } from './registry';
import type { RegistryEntry } from './types';

/** Indirection so specs can provide fixture data instead of the generated indexes. */
export const DOCS_REGISTRY = new InjectionToken<readonly RegistryEntry[]>('DOCS_REGISTRY', {
  providedIn: 'root',
  factory: () => REGISTRY,
});
