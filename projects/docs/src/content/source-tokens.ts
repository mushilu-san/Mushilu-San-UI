import { InjectionToken } from '@angular/core';
import { API } from '../generated/api';
import { DEMO_SOURCES } from '../generated/demo-sources';
import type { ApiIndex } from './api-types';
import type { DemoSourceIndex } from './code-types';

// Kept apart from tokens.ts: the generated indexes are large, and the shell imports tokens.ts
// eagerly. Only the pages that need API tables or demo source import this file.

export const API_INDEX = new InjectionToken<ApiIndex>('API_INDEX', {
  providedIn: 'root',
  factory: () => API,
});

export const DEMO_SOURCE_INDEX = new InjectionToken<DemoSourceIndex>('DEMO_SOURCE_INDEX', {
  providedIn: 'root',
  factory: () => DEMO_SOURCES,
});
