import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewEncapsulation,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { resolveDirection, type Direction } from '@mushilu-san/ui';
import type { SwipeActionColor, SwipeActionItem, SwipeSide } from './swipe-action.types';

const REVEAL_THRESHOLD = 72; // px before actions snap fully open
const MAX_OVERSCROLL = 16; // px of rubber-band past the action rail

/**
 * SwipeAction — a list-row that reveals contextual action buttons on swipe.
 * Supports left and right action rails.
 *
 * Keyboard users: Tab to the row, then use the "More actions" button to open
 * the action rail, or use arrow keys once revealed.
 *
 * Usage:
 *   <mui-swipe-action [actions]="[{key:'delete',label:'Delete',side:'right',color:'danger'}]"
 *                     (actionTriggered)="onAction($event)">
 *     <div>Row content</div>
 *   </mui-swipe-action>
 */
@Component({
  selector: 'mui-swipe-action',
  standalone: true,
  templateUrl: './swipe-action.html',
  styleUrl: './swipe-action.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.part]': '"root"',
    '[attr.data-revealed]': 'revealedSide() ?? null',
  },
})
export class SwipeAction implements OnInit {
  private readonly doc = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Resolved text direction; maps logical start/end onto physical sides. */
  private readonly dir = signal<Direction>('ltr');

  /** Action descriptors. */
  actions = input<SwipeActionItem[]>([]);

  /** Emits the key of the triggered action. */
  readonly actionTriggered = output<string>();

  /** Resolve a (possibly logical) side to the physical side it occupies. */
  private readonly physical = computed(() => {
    const rtl = this.dir() === 'rtl';
    return (side: SwipeSide): 'left' | 'right' => {
      if (side === 'start') return rtl ? 'right' : 'left';
      if (side === 'end') return rtl ? 'left' : 'right';
      return side;
    };
  });

  /** One rail per declared side value (logical rails use inset-inline-*). */
  protected readonly rails = computed(() =>
    (['left', 'start', 'end', 'right'] as const)
      .map((side) => ({ side, actions: this.actions().filter((a) => a.side === side) }))
      .filter((r) => r.actions.length > 0),
  );
  protected readonly hasLeft = computed(() =>
    this.actions().some((a) => this.physical()(a.side) === 'left'),
  );
  protected readonly hasRight = computed(() =>
    this.actions().some((a) => this.physical()(a.side) === 'right'),
  );

  /** Current translate-x offset in pixels. */
  protected readonly offsetX = signal(0);
  /** Which side is snapped open, or null. */
  protected readonly revealedSide = signal<'left' | 'right' | null>(null);

  protected readonly trackStyle = computed(() => ({
    transform: `translateX(${this.offsetX()}px)`,
    transition: this._dragging ? 'none' : 'transform 220ms ease',
  }));

  private readonly trackRef = viewChild<ElementRef<HTMLElement>>('track');

  private _dragging = false;
  private _startX = 0;
  private _startOffset = 0;

  /* ----------------------------------------------------------------
     Touch handlers — zoneless; signal writes drive change detection
     ---------------------------------------------------------------- */
  ngOnInit(): void {
    this.dir.set(resolveDirection(this.host.nativeElement, this.doc));
  }

  @HostListener('touchstart', ['$event'])
  protected onTouchStart(e: TouchEvent): void {
    this.dir.set(resolveDirection(this.host.nativeElement, this.doc));
    const t = e.touches[0];
    if (!t) return;
    this._startX = t.clientX;
    this._startOffset = this.offsetX();
    this._dragging = true;
  }

  @HostListener('touchmove', ['$event'])
  protected onTouchMove(e: TouchEvent): void {
    if (!this._dragging) return;
    const t = e.touches[0];
    if (!t) return;
    const delta = t.clientX - this._startX;
    const raw = this._startOffset + delta;
    this.offsetX.set(this._clamp(raw));
  }

  @HostListener('touchend')
  @HostListener('touchcancel')
  protected onTouchEnd(): void {
    if (!this._dragging) return;
    this._dragging = false;
    this._settle();
  }

  /* ----------------------------------------------------------------
     Keyboard accessibility
     ---------------------------------------------------------------- */
  protected triggerAction(key: string): void {
    this._reset();
    this.actionTriggered.emit(key);
  }

  protected revealSide(side: 'left' | 'right'): void {
    const rail = this._railWidth(side);
    this.offsetX.set(side === 'right' ? -rail : rail);
    this.revealedSide.set(side);
  }

  protected collapse(): void {
    this._reset();
  }

  /* ----------------------------------------------------------------
     Helpers
     ---------------------------------------------------------------- */
  private _railWidth(side: 'left' | 'right'): number {
    const el = this.trackRef()?.nativeElement?.closest('mui-swipe-action');
    const host = (el ?? this.doc.body) as HTMLElement;
    const resolve = this.physical();
    // Widest rail among those (physical or logical) that land on this physical side.
    const widths = (['left', 'start', 'end', 'right'] as const)
      .filter((s) => resolve(s) === side)
      .map((s) => host.querySelector<HTMLElement>(`.mui-swipe-action__rail--${s}`)?.offsetWidth)
      .filter((w): w is number => w !== undefined);
    return widths.length > 0 ? Math.max(...widths) : REVEAL_THRESHOLD;
  }

  private _clamp(raw: number): number {
    const leftMax = this.hasLeft() ? this._railWidth('left') + MAX_OVERSCROLL : 0;
    const rightMax = this.hasRight() ? this._railWidth('right') + MAX_OVERSCROLL : 0;
    return Math.max(-rightMax, Math.min(leftMax, raw));
  }

  private _settle(): void {
    const offset = this.offsetX();
    const rightRail = this.hasRight() ? this._railWidth('right') : 0;
    const leftRail = this.hasLeft() ? this._railWidth('left') : 0;

    if (offset < -REVEAL_THRESHOLD && rightRail > 0) {
      this.offsetX.set(-rightRail);
      this.revealedSide.set('right');
    } else if (offset > REVEAL_THRESHOLD && leftRail > 0) {
      this.offsetX.set(leftRail);
      this.revealedSide.set('left');
    } else {
      this._reset();
    }
  }

  private _reset(): void {
    this.offsetX.set(0);
    this.revealedSide.set(null);
  }

  protected colorClass(color: SwipeActionColor | undefined): string {
    return `mui-swipe-action__action--${color ?? 'primary'}`;
  }
}
