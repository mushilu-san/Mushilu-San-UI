import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewEncapsulation,
  inject,
  input,
  signal,
} from '@angular/core';

import { computePosition, type Placement } from '@mushilu-san/ui';

let tooltipUid = 0;

export type TooltipPlacement = Placement;

/**
 * Attribute component that attaches a tooltip to any host element.
 *
 * Usage:
 *   <button [muiTooltip]="'Save file'" placement="top">Save</button>
 *
 * The component uses ViewEncapsulation.None so its `.mui-tooltip-overlay` CSS class is
 * injected into <head> globally (standard Angular pattern for global overlay styles).
 * The class is deliberately namespaced as `mui-tooltip-overlay` (not bare `mui-tooltip`)
 * to avoid colliding with consumer stylesheets.
 * The template `<ng-content />` projects the host element's original inner content.
 */
@Component({
  selector: '[muiTooltip]',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './tooltip.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.aria-describedby]': 'visible() ? tooltipId : null',
  },
})
export class Tooltip implements OnDestroy {
  /** Tooltip text content. Bound directly via the attribute selector. */
  muiTooltip = input.required<string>();
  /** Preferred placement relative to the host element. */
  placement = input<TooltipPlacement>('top');

  protected readonly tooltipId = `mui-tooltip-${tooltipUid++}`;
  protected readonly visible = signal(false);

  private el: HTMLDivElement | null = null;
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly doc = inject(DOCUMENT);

  @HostListener('mouseenter') onMouseEnter(): void {
    this.show();
  }
  @HostListener('mouseleave') onMouseLeave(): void {
    this.hide();
  }
  @HostListener('focus') onFocus(): void {
    this.show();
  }
  @HostListener('blur') onBlur(): void {
    this.hide();
  }

  private readonly _reposition = (): void => this.position();
  private readonly _docEscape = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') this.hide();
  };

  show(): void {
    if (!this.el) this.create();
    else this.el.textContent = this.muiTooltip();
    this.position();
    this.visible.set(true);
    window.addEventListener('scroll', this._reposition, { capture: true, passive: true });
    window.addEventListener('resize', this._reposition, { passive: true });
    this.doc.addEventListener('keydown', this._docEscape);
  }

  hide(): void {
    this.visible.set(false);
    this.el?.remove();
    this.el = null;
    window.removeEventListener('scroll', this._reposition, { capture: true });
    window.removeEventListener('resize', this._reposition);
    this.doc.removeEventListener('keydown', this._docEscape);
  }

  ngOnDestroy(): void {
    this.hide();
  }

  private create(): void {
    const div = this.doc.createElement('div');
    div.id = this.tooltipId;
    div.setAttribute('role', 'tooltip');
    div.className = 'mui-tooltip-overlay';
    div.setAttribute('data-placement', this.placement());
    div.textContent = this.muiTooltip();
    this.doc.body.appendChild(div);
    this.el = div;
  }

  private position(): void {
    const el = this.el;
    if (!el) return;

    Object.assign(el.style, { position: 'fixed', visibility: 'hidden', top: '0px', left: '0px' });

    const rect = this.host.nativeElement.getBoundingClientRect();
    const { top, left } = computePosition(
      rect,
      el.offsetWidth || 0,
      el.offsetHeight || 0,
      this.placement(),
    );

    Object.assign(el.style, { visibility: '', top: `${top}px`, left: `${left}px` });
  }
}
