import { InjectionToken } from '@angular/core';
import { API } from '../generated/api';
import { DEMO_SOURCES } from '../generated/demo-sources';
import type { ApiIndex } from './api-types';
import type { DemoSourceIndex } from './code-types';
import { REGISTRY } from './registry';
import type { RegistryEntry } from './types';

/** Indirection so specs can provide fixture data instead of the generated indexes. */
export const DOCS_REGISTRY = new InjectionToken<readonly RegistryEntry[]>('DOCS_REGISTRY', {
  providedIn: 'root',
  factory: () => REGISTRY,
});

export const API_INDEX = new InjectionToken<ApiIndex>('API_INDEX', {
  providedIn: 'root',
  factory: () => API,
});

export const DEMO_SOURCE_INDEX = new InjectionToken<DemoSourceIndex>('DEMO_SOURCE_INDEX', {
  providedIn: 'root',
  factory: () => DEMO_SOURCES,
});
