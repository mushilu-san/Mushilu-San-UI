import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewEncapsulation,
  computed,
  inject,
} from '@angular/core';
import { createDrag, type DragSession } from '@mushilu-san/ui';
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
export class CarouselContent implements OnDestroy {
  private readonly ctx = inject(CAROUSEL_CONTEXT);
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly doc = inject(DOCUMENT);

  protected readonly transform = computed(() => `translateX(-${this.ctx.active() * 100}%)`);

  private _startX = 0;
  private _dragSession: DragSession | null = null;

  protected onPointerDown(event: PointerEvent): void {
    this._startX = event.clientX;
    this.el.nativeElement.setPointerCapture?.(event.pointerId);
    this._dragSession?.destroy();
    this._dragSession = createDrag(this.doc, {
      onEnd: (e) => {
        const deltaX = e.clientX - this._startX;
        const threshold = this.el.nativeElement.offsetWidth * 0.25;
        if (Math.abs(deltaX) < threshold) return;
        if (deltaX < 0) this.ctx.next();
        else this.ctx.prev();
      },
    });
  }

  ngOnDestroy(): void {
    this._dragSession?.destroy();
  }
}
