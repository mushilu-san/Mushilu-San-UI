import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  model,
  numberAttribute,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';
import { createDrag, resolveDirection, useCva, type DragSession } from '@mushilu-san/ui';

@Component({
  selector: 'mui-slider',
  standalone: true,
  templateUrl: './slider.html',
  styleUrl: './slider.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Slider),
      multi: true,
    },
  ],
  host: {
    '[attr.data-disabled]': 'isDisabled() || null',
    '[attr.part]': '"root"',
  },
})
export class Slider implements ControlValueAccessor, OnDestroy {
  /** Lowest value on the slider. Default `0`. */
  min = input(0, { transform: numberAttribute });
  /** Highest value on the slider. Default `100`. */
  max = input(100, { transform: numberAttribute });
  /** Distance between allowed values. Default `1`. */
  step = input(1, { transform: numberAttribute });
  /** Disables the slider. Keyboard and pointer input are ignored. */
  disabled = input(false, { transform: booleanAttribute });
  /** Current value. Two-way bindable with `[(value)]`. */
  value = model(0);
  /** Accessible name for the thumb. Set it, since `aria-label` on the host does not reach the thumb (#729). */
  label = input<string>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly doc = inject(DOCUMENT);
  private _dragSession: DragSession | null = null;
  private readonly trackRef = viewChild.required<ElementRef<HTMLDivElement>>('trackRef');

  private readonly _cva = useCva<number>(this.disabled);
  protected readonly isDisabled = this._cva.isDisabled;

  protected readonly fillPercent = computed(() => {
    const range = this.max() - this.min();
    if (range === 0) return 0;
    return Math.max(0, Math.min(100, ((this.value() - this.min()) / range) * 100));
  });

  // aria-valuenow is a mandatory ARIA slider attribute — never let it be stripped from the DOM
  // (Angular removes [attr.x] bindings that resolve to null/undefined) if value() is transiently
  // unset by an upstream two-way binding.
  protected readonly ariaValueNow = computed(() => this.value() ?? this.min());

  protected onKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;
    const s = this.step();
    const big = (this.max() - this.min()) * 0.1;
    let next = this.value();

    // WAI-ARIA APG: in RTL, ArrowLeft increases and ArrowRight decreases.
    const rtl = resolveDirection(this.host.nativeElement) === 'rtl';
    const inc = rtl ? 'ArrowLeft' : 'ArrowRight';
    const dec = rtl ? 'ArrowRight' : 'ArrowLeft';
    const key = event.key === inc ? 'Increase' : event.key === dec ? 'Decrease' : event.key;

    switch (key) {
      case 'Increase':
      case 'ArrowUp':
        event.preventDefault();
        next = Math.min(this.max(), next + s);
        break;
      case 'Decrease':
      case 'ArrowDown':
        event.preventDefault();
        next = Math.max(this.min(), next - s);
        break;
      case 'Home':
        event.preventDefault();
        next = this.min();
        break;
      case 'End':
        event.preventDefault();
        next = this.max();
        break;
      case 'PageUp':
        event.preventDefault();
        next = Math.min(this.max(), next + big);
        break;
      case 'PageDown':
        event.preventDefault();
        next = Math.max(this.min(), next - big);
        break;
      default:
        return;
    }
    this.commit(next);
  }

  protected onTrackPointerDown(event: PointerEvent): void {
    if (this.isDisabled()) return;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this.setFromClientX(event.clientX);
    this.endDrag();
    this._dragSession = createDrag(this.doc, {
      onMove: (e) => {
        if (this.isDisabled() || e.buttons === 0) return;
        this.setFromClientX(e.clientX);
      },
      onEnd: () => {
        this._dragSession = null;
      },
    });
  }

  /** Stops following the pointer. Also called on `pointercancel`, which `createDrag` does not see. */
  protected endDrag(): void {
    this._dragSession?.destroy();
    this._dragSession = null;
  }

  ngOnDestroy(): void {
    this.endDrag();
  }

  protected onBlur(): void {
    this._cva.onTouched();
  }

  private setFromClientX(clientX: number): void {
    const track = this.trackRef();
    const rect = track.nativeElement.getBoundingClientRect();
    const raw0 = (clientX - rect.left) / rect.width;
    const dirRatio = resolveDirection(this.host.nativeElement) === 'rtl' ? 1 - raw0 : raw0;
    const ratio = Math.max(0, Math.min(1, dirRatio));
    const raw = this.min() + ratio * (this.max() - this.min());
    const snapped = Math.round(raw / this.step()) * this.step();
    this.commit(Math.max(this.min(), Math.min(this.max(), snapped)));
  }

  private commit(v: number): void {
    const rounded = Math.round(v * 1e10) / 1e10;
    this.value.set(rounded);
    this._cva.onChange(rounded);
  }

  writeValue(v: number): void {
    this.value.set(v ?? 0);
  }
  registerOnChange(fn: (v: number) => void): void {
    this._cva.registerOnChange(fn);
  }
  registerOnTouched(fn: () => void): void {
    this._cva.registerOnTouched(fn);
  }
  setDisabledState(isDisabled: boolean): void {
    this._cva.setDisabledState(isDisabled);
  }
}
