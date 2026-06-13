import { Injectable, OnDestroy, inject, DOCUMENT } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LiveAnnouncer implements OnDestroy {
  private readonly doc = inject(DOCUMENT);
  private el: HTMLElement | null = null;

  announce(message: string, politeness: 'polite' | 'assertive' = 'polite'): void {
    const el = this.getOrCreateElement(politeness);
    el.textContent = '';
    // Force a DOM reflow so screen readers re-announce identical messages.
    requestAnimationFrame(() => {
      el.textContent = message;
    });
  }

  ngOnDestroy(): void {
    this.el?.remove();
    this.el = null;
  }

  private getOrCreateElement(politeness: 'polite' | 'assertive'): HTMLElement {
    if (!this.el) {
      this.el = this.doc.createElement('div');
      Object.assign(this.el.style, {
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0,0,0,0)',
        whiteSpace: 'nowrap',
        border: '0',
      });
      this.doc.body.appendChild(this.el);
    }
    this.el.setAttribute('aria-live', politeness);
    this.el.setAttribute('aria-atomic', 'true');
    return this.el;
  }
}
