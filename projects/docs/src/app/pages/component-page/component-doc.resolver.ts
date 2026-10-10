import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import { findEntry } from '../../../content/registry';
import { DOCS_REGISTRY } from '../../../content/tokens';
import type { ComponentDoc } from '../../../content/types';

/**
 * Resolves the page's doc before activation so the first client render matches the prerendered
 * HTML (no "Loading" flash, hydration-safe) and fragment links can scroll immediately.
 */
export const componentDocResolver: ResolveFn<ComponentDoc | undefined> = (route) => {
  const entry = findEntry(route.paramMap.get('slug') ?? '', inject(DOCS_REGISTRY));
  return entry ? entry.load().catch(() => undefined) : undefined;
};
