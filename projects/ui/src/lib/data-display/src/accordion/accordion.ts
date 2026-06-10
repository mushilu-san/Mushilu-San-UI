import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  input,
  signal,
} from '@angular/core';
import type { AccordionContext, AccordionItemRef } from './accordion.types';
import { ACCORDION_CONTEXT } from './accordion.types';

@Component({
  selector: 'mui-accordion',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './accordion.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.part]': '"root"',
  },
  providers: [
    { provide: ACCORDION_CONTEXT, useExisting: AccordionGroup },
  ],
})
export class AccordionGroup implements AccordionContext {
  /** Allow multiple panels open simultaneously. Defaults to single-open. */
  multiple = input(false, { transform: booleanAttribute });

  readonly openIds = signal<ReadonlySet<string>>(new Set());

  private items: AccordionItemRef[] = [];

  register(item: AccordionItemRef): void {
    this.items = [...this.items, item];
  }

  unregister(item: AccordionItemRef): void {
    this.items = this.items.filter((i) => i !== item);
  }

  toggle(id: string): void {
    const curr = this.openIds();
    if (this.multiple()) {
      const next = new Set(curr);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      this.openIds.set(next);
    } else {
      this.openIds.set(curr.has(id) ? new Set() : new Set([id]));
    }
  }

  private enabled(): AccordionItemRef[] {
    return this.items.filter((i) => !i.disabled());
  }

  focusNext(item: AccordionItemRef): void {
    const list = this.enabled();
    const idx = list.indexOf(item);
    list[(idx + 1) % list.length]?.focusTrigger();
  }

  focusPrev(item: AccordionItemRef): void {
    const list = this.enabled();
    const idx = list.indexOf(item);
    list[(idx - 1 + list.length) % list.length]?.focusTrigger();
  }

  focusFirst(): void {
    this.enabled()[0]?.focusTrigger();
  }

  focusLast(): void {
    const list = this.enabled();
    list[list.length - 1]?.focusTrigger();
  }
}
