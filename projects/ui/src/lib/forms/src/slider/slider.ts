import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  model,
  numberAttribute,
  viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';
import { useCva } from '@mushilu-san/ui';

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
export class Slider implements ControlValueAccessor {
  min = input(0, { transform: numberAttribute });
  max = input(100, { transform: numberAttribute });
  step = input(1, { transform: numberAttribute });
  disabled = input(false, { transform: booleanAttribute });
  value = model(0);

  private readonly trackRef = viewChild.required<ElementRef<HTMLDivElement>>('trackRef');

  private readonly _cva = useCva<number>(this.disabled);
  protected readonly isDisabled = this._cva.isDisabled;

  protected readonly fillPercent = computed(() => {
    const range = this.max() - this.min();
    if (range === 0) return 0;
    return Math.max(0, Math.min(100, ((this.value() - this.min()) / range) * 100));
  });

  protected onKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;
    const s = this.step();
    const big = (this.max() - this.min()) * 0.1;
    let next = this.value();

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault();
        next = Math.min(this.max(), next + s);
        break;
      case 'ArrowLeft':
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
  }

  protected onTrackPointerMove(event: PointerEvent): void {
    if (this.isDisabled() || event.buttons === 0) return;
    this.setFromClientX(event.clientX);
  }

  protected onBlur(): void {
    this._cva.onTouched();
  }

  private setFromClientX(clientX: number): void {
    const track = this.trackRef();
    const rect = track.nativeElement.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
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
