import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  computed,
  inject,
  signal,
} from '@angular/core';
import { createDrag, resolveDirection, type Direction, type DragSession } from '@mushilu-san/ui';
import { CAROUSEL_CONTEXT } from './carousel-context';

@Component({
  selector: 'mui-carousel-content',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './carousel-content.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.part]': '"content"',
    '[style.transform]': 'transform()',
    '(pointerdown)': 'onPointerDown($event)',
  },
})
export class CarouselContent implements OnInit, OnDestroy {
  private readonly ctx = inject(CAROUSEL_CONTEXT);
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly doc = inject(DOCUMENT);

  /** Resolved text direction; flex items flow right-to-left under RTL (H-B-81647a). */
  private readonly dir = signal<Direction>('ltr');

  protected readonly transform = computed(() => {
    const offset = this.ctx.active() * 100;
    return this.dir() === 'rtl' ? `translateX(${offset}%)` : `translateX(-${offset}%)`;
  });

  private _startX = 0;
  private _dragSession: DragSession | null = null;

  ngOnInit(): void {
    this.dir.set(resolveDirection(this.el.nativeElement, this.doc));
  }

  protected onPointerDown(event: PointerEvent): void {
    const dir = resolveDirection(this.el.nativeElement, this.doc);
    this.dir.set(dir);
    this._startX = event.clientX;
    this.el.nativeElement.setPointerCapture?.(event.pointerId);
    this._dragSession?.destroy();
    this._dragSession = createDrag(this.doc, {
      onEnd: (e) => {
        const deltaX = e.clientX - this._startX;
        const threshold = this.el.nativeElement.offsetWidth * 0.25;
        if (Math.abs(deltaX) < threshold) return;
        // LTR: drag left = next. RTL: drag right = next (H-B-81647a).
        const towardNext = dir === 'rtl' ? deltaX > 0 : deltaX < 0;
        if (towardNext) this.ctx.next();
        else this.ctx.prev();
      },
    });
  }

  ngOnDestroy(): void {
    this._dragSession?.destroy();
  }
}
