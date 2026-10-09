import { DOCUMENT } from '@angular/common';
import { Injectable, OnDestroy, inject, signal } from '@angular/core';

export type Direction = 'ltr' | 'rtl';

function normalise(value: string | null | undefined): Direction | null {
  const v = value?.toLowerCase();
  return v === 'rtl' || v === 'ltr' ? v : null;
}

/**
 * Resolve the effective text direction for an element.
 * Order: nearest ancestor `[dir]` (ignoring `auto`) -> computed `direction`
 * -> `documentElement.dir` -> 'ltr'.
 */
export function resolveDirection(el: Element | null, doc?: Document): Direction {
  const d = doc ?? el?.ownerDocument ?? (typeof document !== 'undefined' ? document : null);
  if (el) {
    const attr = normalise(el.closest('[dir]:not([dir="auto"])')?.getAttribute('dir'));
    if (attr) return attr;
    const computed = normalise(d?.defaultView?.getComputedStyle(el).direction);
    if (computed) return computed;
  }
  return normalise(d?.documentElement?.dir) ?? 'ltr';
}

/** Root service exposing the document-level direction as a signal. */
@Injectable({ providedIn: 'root' })
export class Directionality implements OnDestroy {
  private readonly doc = inject(DOCUMENT);
  private observer: MutationObserver | null = null;
  private readonly _value = signal<Direction>(this.read());

  /** Current document direction. */
  readonly value = this._value.asReadonly();

  constructor() {
    const view = this.doc.defaultView;
    if (view && typeof view.MutationObserver === 'function') {
      this.observer = new view.MutationObserver(() => this._value.set(this.read()));
      const opts = { attributes: true, attributeFilter: ['dir'] };
      this.observer.observe(this.doc.documentElement, opts);
      if (this.doc.body) this.observer.observe(this.doc.body, opts);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  private read(): Direction {
    return normalise(this.doc.body?.dir) ?? normalise(this.doc.documentElement?.dir) ?? 'ltr';
  }
}
