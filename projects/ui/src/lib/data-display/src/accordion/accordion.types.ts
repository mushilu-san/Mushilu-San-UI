import { InjectionToken } from '@angular/core';
import type { Signal } from '@angular/core';

/** Contract the group provides via DI so item ↔ group stay decoupled. */
export interface AccordionContext {
  readonly openIds: Signal<ReadonlySet<string>>;
  toggle(id: string): void;
}

export const ACCORDION_CONTEXT = new InjectionToken<AccordionContext>('ACCORDION_CONTEXT');
