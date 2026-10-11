import type { ResolveFn } from '@angular/router';
import { GROUPS } from '../content/groups';
import { findEntry } from '../content/registry';

export const componentTitle: ResolveFn<string> = (route) =>
  findEntry(route.paramMap.get('slug') ?? '')?.name ?? 'Not found';

export const groupTitle: ResolveFn<string> = (route) =>
  GROUPS.find((g) => g.id === route.paramMap.get('group'))?.label ?? 'Not found';
