import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  Signal,
  ViewEncapsulation,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  RESIZABLE_GROUP_CONTEXT,
  ResizableGroupContext,
  ResizablePanelRegistration,
} from './resizable-context';

interface PanelEntry {
  defaultSize: number;
  minSize: number;
  maxSize: number;
}

@Component({
  selector: 'mui-resizable-panel-group',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './resizable-panel-group.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    {
      provide: RESIZABLE_GROUP_CONTEXT,
      useExisting: forwardRef(() => ResizablePanelGroup),
    },
  ],
  host: {
    '[attr.data-direction]': 'direction()',
    '[attr.part]':           '"root"',
  },
})
export class ResizablePanelGroup implements ResizableGroupContext, OnDestroy {
  direction = input<'horizontal' | 'vertical'>('horizontal');

  private readonly el     = inject(ElementRef<HTMLElement>);
  private readonly ngZone = inject(NgZone);

  private readonly _registry: PanelEntry[]       = [];
  private readonly _sizes: ReturnType<typeof signal<number[]>> = signal([]);
  private readonly _sizeSignals: Signal<number>[] = [];

  private _dragState: {
    panelAIdx: number;
    panelBIdx: number;
    containerSize: number;
    startPos: number;
  } | null = null;

  private _moveListener = (e: PointerEvent) => this._onPointerMove(e);
  private _upListener   = (e: PointerEvent) => this._onPointerUp(e);

  registerPanel(defaultSize: number, minSize: number, maxSize: number): ResizablePanelRegistration {
    const idx = this._registry.length;
    this._registry.push({ defaultSize, minSize, maxSize });

    const sizes = this._registry;
    const total = sizes.reduce((s, p) => s + p.defaultSize, 0) || 100;
    const normalized = sizes.map(p => (p.defaultSize / total) * 100);
    this._sizes.set(normalized);

    const sizeSignal = computed(() => this._sizes()[idx] ?? defaultSize);
    this._sizeSignals[idx] = sizeSignal;

    return { idx, size: sizeSignal };
  }

  startResize(event: PointerEvent, handleEl: HTMLElement): void {
    const siblings = Array.from(handleEl.parentElement!.children);
    const handlePos = siblings.indexOf(handleEl);
    const panelAIdx = Math.floor((handlePos - 1) / 2);
    const panelBIdx = panelAIdx + 1;

    if (panelAIdx < 0 || panelBIdx >= this._registry.length) return;

    const containerRect = this.el.nativeElement.getBoundingClientRect();
    const containerSize = this.direction() === 'horizontal'
      ? containerRect.width
      : containerRect.height;

    handleEl.setPointerCapture?.(event.pointerId);

    this._dragState = {
      panelAIdx,
      panelBIdx,
      containerSize,
      startPos: this.direction() === 'horizontal' ? event.clientX : event.clientY,
    };

    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('pointermove', this._moveListener);
      document.addEventListener('pointerup', this._upListener);
    });
  }

  private _onPointerMove(event: PointerEvent): void {
    if (!this._dragState) return;
    const { panelAIdx, panelBIdx, containerSize, startPos } = this._dragState;

    const pos     = this.direction() === 'horizontal' ? event.clientX : event.clientY;
    const deltaAbs = pos - startPos;
    if (containerSize === 0) return;
    const deltaPct = (deltaAbs / containerSize) * 100;

    this.ngZone.run(() => {
      this._applyDelta(panelAIdx, panelBIdx, deltaPct);
      this._dragState!.startPos = pos;
    });
  }

  resizeByPercent(handleEl: HTMLElement, deltaPct: number): void {
    const siblings  = Array.from(handleEl.parentElement!.children);
    const handlePos = siblings.indexOf(handleEl);
    const panelAIdx = Math.floor((handlePos - 1) / 2);
    const panelBIdx = panelAIdx + 1;
    if (panelAIdx < 0 || panelBIdx >= this._registry.length) return;
    this._applyDelta(panelAIdx, panelBIdx, deltaPct);
  }

  private _applyDelta(panelAIdx: number, panelBIdx: number, deltaPct: number): void {
    this._sizes.update(sizes => {
      const s    = [...sizes];
      const reg  = this._registry;
      const newA = Math.max(reg[panelAIdx].minSize, Math.min(reg[panelAIdx].maxSize, s[panelAIdx] + deltaPct));
      const act  = newA - s[panelAIdx];
      const newB = Math.max(reg[panelBIdx].minSize, Math.min(reg[panelBIdx].maxSize, s[panelBIdx] - act));
      s[panelAIdx] = newA;
      s[panelBIdx] = newB;
      return s;
    });
  }

  private _onPointerUp(_event: PointerEvent): void {
    this._dragState = null;
    document.removeEventListener('pointermove', this._moveListener);
    document.removeEventListener('pointerup', this._upListener);
  }

  ngOnDestroy(): void {
    document.removeEventListener('pointermove', this._moveListener);
    document.removeEventListener('pointerup', this._upListener);
  }
}
