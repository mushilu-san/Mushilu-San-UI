import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
  input,
  model,
  numberAttribute,
  signal,
} from '@angular/core';
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
    'role':                     'region',
    '[attr.aria-label]':        'label()',
    '[attr.aria-roledescription]': '"carousel"',
    '[attr.part]':              '"root"',
    '(keydown.arrowLeft)':      'prev()',
    '(keydown.arrowRight)':     'next()',
  },
})
export class Carousel implements CarouselContext, OnInit, OnDestroy {
  active   = model(0);
  loop     = input(false, { transform: booleanAttribute });
  autoPlay = input(0, { transform: numberAttribute });
  label    = input('Carousel');

  private readonly _count = signal(0);
  readonly count          = this._count.asReadonly();

  private _timer: ReturnType<typeof setInterval> | null = null;

  /** Called by CarouselItem components to register themselves. */
  registerItem(): number {
    const idx = this._count();
    this._count.update(n => n + 1);
    return idx;
  }

  ngOnInit(): void {
    if (this.autoPlay() > 0) {
      this._timer = setInterval(() => this.next(), this.autoPlay());
    }
  }

  ngOnDestroy(): void {
    if (this._timer !== null) clearInterval(this._timer);
  }

  next(): void {
    const n = this._count();
    if (n === 0) return;
    this.active.update(i => {
      if (i < n - 1) return i + 1;
      return this.loop() ? 0 : i;
    });
  }

  prev(): void {
    const n = this._count();
    if (n === 0) return;
    this.active.update(i => {
      if (i > 0) return i - 1;
      return this.loop() ? n - 1 : i;
    });
  }

  goTo(idx: number): void {
    const n = this._count();
    if (idx >= 0 && idx < n) this.active.set(idx);
  }
}
