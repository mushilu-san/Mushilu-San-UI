import { DOCUMENT } from '@angular/common';
import { Injector, Signal, afterNextRender, effect, inject } from '@angular/core';
import { computePosition, type Placement } from '@mushilu-san/ui';
import type { PopoverPlacement } from '../popover/popover.types';

const VIEWPORT_MARGIN = 4;

/** Plain rect literal: jsdom has no `DOMRect` constructor. */
const rect = (left: number, top: number, width: number, height: number): DOMRect =>
  ({ left, top, width, height, right: left + width, bottom: top + height }) as DOMRect;

/**
 * Places `panel` (position: absolute inside `origin`, or position: fixed when `origin` is
 * omitted) next to `anchor` through the shared `computePosition()`, clamped to the viewport.
 * `<side>-start` / `<side>-end` align the cross axis to the anchor's start / end edge.
 */
export function positionPanel(
  panel: HTMLElement,
  anchor: DOMRect,
  placement: PopoverPlacement,
  opts: { rtl: boolean; gap?: number; origin?: DOMRect },
): void {
  const [side, align] = placement.split('-') as [Placement, 'start' | 'end' | undefined];
  const w = panel.offsetWidth;
  const h = panel.offsetHeight;
  let target = anchor;
  if (align) {
    // computePosition centres on the anchor: hand it an anchor of the panel's own size
    // so "centred" means "flush with the chosen edge".
    if (side === 'top' || side === 'bottom') {
      const left = (align === 'start') !== opts.rtl ? anchor.left : anchor.right - w;
      target = rect(left, anchor.top, w, anchor.height);
    } else {
      const top = align === 'start' ? anchor.top : anchor.bottom - h;
      target = rect(anchor.left, top, anchor.width, h);
    }
  }
  const { top, left } = computePosition(target, w, h, side, opts.gap ?? 8, VIEWPORT_MARGIN, {
    rtl: opts.rtl,
  });
  panel.style.top = `${top - (opts.origin?.top ?? 0)}px`;
  panel.style.left = `${left - (opts.origin?.left ?? 0)}px`;
}

/**
 * While `open()` is true: runs `place` once the panel has rendered, then again on every
 * scroll (any ancestor) and resize. Call from a constructor / injection context.
 */
export function anchoredPanel(config: {
  open: Signal<boolean>;
  panel: () => HTMLElement | undefined;
  place: (panel: HTMLElement) => void;
}): void {
  const injector = inject(Injector);
  const win = inject(DOCUMENT).defaultView;
  effect((onCleanup) => {
    if (!config.open()) return;
    const run = (): void => {
      const panel = config.panel();
      if (panel) config.place(panel);
    };
    afterNextRender(run, { injector });
    win?.addEventListener('scroll', run, { capture: true, passive: true });
    win?.addEventListener('resize', run, { passive: true });
    onCleanup(() => {
      win?.removeEventListener('scroll', run, { capture: true });
      win?.removeEventListener('resize', run);
    });
  });
}
