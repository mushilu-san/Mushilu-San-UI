import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  numberAttribute,
  signal,
} from '@angular/core';
import { resolveDirection } from '@mushilu-san/ui';
import { CAROUSEL_CONTEXT, CarouselContext } from './carousel-context';

@Component({
  selector: 'mui-carousel',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './carousel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    {
      provide: CAROUSEL_CONTEXT,
      useExisting: forwardRef(() => Carousel),
    },
  ],
  host: {
    role: 'region',
    '[attr.aria-label]': 'label()',
    '[attr.aria-roledescription]': '"carousel"',
    '[attr.part]': '"root"',
    '(keydown)': 'onKeydown($event)',
  },
})
export class Carousel implements CarouselContext {
  /** Index of the visible slide, starting at 0. Two-way bindable with `[(active)]`. */
  active = model(0);
  /** Wraps from the last slide to the first and back. Default `false`. */
  loop = input(false, { transform: booleanAttribute });
  /** Advances to the next slide every N milliseconds. `0` turns auto-play off. Default `0`. */
  autoPlay = input(0, { transform: numberAttribute });
  /** Accessible name of the carousel region. Default `Carousel`. */
  label = input('Carousel');

  /** Live items in registration order; an item's slide index is its position here. */
  private readonly _items = signal<readonly object[]>([]);
  private readonly _count = computed(() => this._items().length);
  readonly count = this._count;

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    // Clamp active index whenever item count decreases (B-8).
    effect(() => {
      const n = this._count();
      if (n > 0 && this.active() >= n) {
        this.active.set(n - 1);
      }
    });

    // (Re)start auto-play whenever the interval changes; cleanup stops the old timer (H-B-3d9b82).
    effect((onCleanup) => {
      const ms = this.autoPlay();
      if (ms > 0) {
        const timer = setInterval(() => this.next(), ms);
        onCleanup(() => clearInterval(timer));
      }
    });
  }

  /** Called by CarouselItem on ngOnInit. */
  registerItem(item: object): void {
    this._items.update((items) => (items.includes(item) ? items : [...items, item]));
  }

  /** Called by CarouselItem on ngOnDestroy; later items shift down so indices stay contiguous. */
  unregisterItem(item: object): void {
    this._items.update((items) => items.filter((i) => i !== item));
  }

  /** Current slide index of a registered item, or -1. */
  indexOf(item: object): number {
    return this._items().indexOf(item);
  }

  /** ArrowRight = next in LTR, prev in RTL (H-A-e64f76). */
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const rtl = resolveDirection(this.el.nativeElement) === 'rtl';
    const forward = rtl ? event.key === 'ArrowLeft' : event.key === 'ArrowRight';
    if (forward) this.next();
    else this.prev();
  }

  next(): void {
    const n = this._count();
    if (n === 0) return;
    this.active.update((i) => {
      if (i < n - 1) return i + 1;
      return this.loop() ? 0 : i;
    });
  }

  prev(): void {
    const n = this._count();
    if (n === 0) return;
    this.active.update((i) => {
      if (i > 0) return i - 1;
      return this.loop() ? n - 1 : i;
    });
  }

  goTo(idx: number): void {
    const n = this._count();
    if (idx >= 0 && idx < n) this.active.set(idx);
  }
}
