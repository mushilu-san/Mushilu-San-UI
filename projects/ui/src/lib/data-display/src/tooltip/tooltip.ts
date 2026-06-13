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

let tooltipUid = 0;

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

/**
 * Attribute component that attaches a tooltip to any host element.
 *
 * Usage:
 *   <button [muiTooltip]="'Save file'" placement="top">Save</button>
 *
 * The component uses ViewEncapsulation.None so its `.mui-tooltip` CSS class is
 * injected into <head> globally (standard Angular pattern for global overlay styles).
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
  @HostListener('keydown.escape') onEscape(): void {
    this.hide();
  }

  show(): void {
    if (!this.el) this.create();
    this.position();
    this.visible.set(true);
  }

  hide(): void {
    this.visible.set(false);
    this.el?.remove();
    this.el = null;
  }

  ngOnDestroy(): void {
    this.hide();
  }

  private create(): void {
    const div = document.createElement('div');
    div.id = this.tooltipId;
    div.setAttribute('role', 'tooltip');
    div.className = 'mui-tooltip';
    div.setAttribute('data-placement', this.placement());
    div.textContent = this.muiTooltip();
    document.body.appendChild(div);
    this.el = div;
  }

  private position(): void {
    const el = this.el;
    if (!el) return;

    const rect = this.host.nativeElement.getBoundingClientRect();

    // Measure at off-screen position before setting final coords.
    Object.assign(el.style, {
      position: 'fixed',
      visibility: 'hidden',
      top: '0px',
      left: '0px',
    });

    const tw = el.offsetWidth || 0;
    const th = el.offsetHeight || 0;
    const gap = 8;

    let top: number, left: number;

    switch (this.placement()) {
      case 'bottom':
        top = rect.bottom + gap;
        left = rect.left + (rect.width - tw) / 2;
        break;
      case 'left':
        top = rect.top + (rect.height - th) / 2;
        left = rect.left - tw - gap;
        break;
      case 'right':
        top = rect.top + (rect.height - th) / 2;
        left = rect.right + gap;
        break;
      case 'top':
      default:
        top = rect.top - th - gap;
        left = rect.left + (rect.width - tw) / 2;
        break;
    }

    Object.assign(el.style, {
      visibility: '',
      top: `${top}px`,
      left: `${left}px`,
    });
  }
}
