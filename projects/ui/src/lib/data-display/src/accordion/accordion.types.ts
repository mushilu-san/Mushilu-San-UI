import { InjectionToken } from '@angular/core';
import type { Signal } from '@angular/core';

/** Minimal shape the accordion group exposes to each item. */
export interface AccordionItemRef {
  readonly disabled: Signal<boolean>;
  focusTrigger(): void;
}

/** Contract the group provides via DI so item ↔ group stay decoupled. */
export interface AccordionContext {
  readonly openIds: Signal<ReadonlySet<string>>;
  toggle(id: string): void;
  register(item: AccordionItemRef): void;
  unregister(item: AccordionItemRef): void;
  focusNext(item: AccordionItemRef): void;
  focusPrev(item: AccordionItemRef): void;
  focusFirst(): void;
  focusLast(): void;
}

export const ACCORDION_CONTEXT = new InjectionToken<AccordionContext>('ACCORDION_CONTEXT');
