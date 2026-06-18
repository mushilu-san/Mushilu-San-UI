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
  private _dragging = false;
  private _upListener = (e: PointerEvent) => this._onUp(e);

  protected onPointerDown(event: PointerEvent): void {
    this._startX = event.clientX;
    this._dragging = true;
    this.el.nativeElement.setPointerCapture?.(event.pointerId);
    this.doc.addEventListener('pointerup', this._upListener);
  }

  private _onUp(event: PointerEvent): void {
    if (!this._dragging) return;
    this._dragging = false;
    this.doc.removeEventListener('pointerup', this._upListener);

    const deltaX = event.clientX - this._startX;
    const threshold = this.el.nativeElement.offsetWidth * 0.25;
    if (Math.abs(deltaX) < threshold) return;
    if (deltaX < 0) this.ctx.next();
    else this.ctx.prev();
  }

  ngOnDestroy(): void {
    this.doc.removeEventListener('pointerup', this._upListener);
  }
}
