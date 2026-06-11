import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';
import { RESIZABLE_GROUP_CONTEXT } from './resizable-context';

@Component({
  selector: 'mui-resizable-handle',
  standalone: true,
  templateUrl: './resizable-handle.html',
  styleUrl: './resizable-handle.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.data-direction]': 'direction()',
    '[attr.data-handle]':    'withHandle() || null',
    '[attr.part]':           '"handle"',
    'role':                  'separator',
    '[attr.aria-orientation]': 'direction() === "horizontal" ? "vertical" : "horizontal"',
    '(pointerdown)': 'onPointerDown($event)',
    '(keydown)':     'onKeydown($event)',
    'tabindex':      '0',
  },
})
export class ResizableHandle {
  withHandle = input(false, { transform: booleanAttribute });

  private readonly ctx = inject(RESIZABLE_GROUP_CONTEXT);
  private readonly el  = inject(ElementRef<HTMLElement>);

  protected readonly direction = computed(() => this.ctx.direction());
  protected readonly gripDots: [number, number][] = [
    [8,8],[8,12],[8,16],[16,8],[16,12],[16,16],
  ];

  protected onPointerDown(event: PointerEvent): void {
    event.preventDefault();
    this.ctx.startResize(event, this.el.nativeElement);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const isH = this.ctx.direction() === 'horizontal';
    const fwd = isH ? 'ArrowRight' : 'ArrowDown';
    const bwd = isH ? 'ArrowLeft'  : 'ArrowUp';
    if (event.key !== fwd && event.key !== bwd) return;
    event.preventDefault();
    const step  = event.shiftKey ? 10 : 1;
    const delta = event.key === fwd ? step : -step;
    this.ctx.resizeByPercent(this.el.nativeElement, delta);
  }
}
