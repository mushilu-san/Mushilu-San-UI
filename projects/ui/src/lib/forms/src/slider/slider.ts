import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  model,
  numberAttribute,
  signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

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
    '[attr.part]':          '"root"',
  },
})
export class Slider implements ControlValueAccessor {
  min      = input(0,   { transform: numberAttribute });
  max      = input(100, { transform: numberAttribute });
  step     = input(1,   { transform: numberAttribute });
  disabled = input(false, { transform: booleanAttribute });
  value    = model(0);

  @ViewChild('trackRef', { static: true }) private trackRef!: ElementRef<HTMLDivElement>;

  private readonly cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  protected readonly fillPercent = computed(() => {
    const range = this.max() - this.min();
    if (range === 0) return 0;
    return Math.max(0, Math.min(100, ((this.value() - this.min()) / range) * 100));
  });

  private _onChange: (v: number) => void = () => undefined;
  private _onTouched: () => void = () => undefined;

  protected onKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;
    const s    = this.step();
    const big  = (this.max() - this.min()) * 0.1;
    let   next = this.value();

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':    event.preventDefault(); next = Math.min(this.max(), next + s);   break;
      case 'ArrowLeft':
      case 'ArrowDown':  event.preventDefault(); next = Math.max(this.min(), next - s);   break;
      case 'Home':       event.preventDefault(); next = this.min();                        break;
      case 'End':        event.preventDefault(); next = this.max();                        break;
      case 'PageUp':     event.preventDefault(); next = Math.min(this.max(), next + big); break;
      case 'PageDown':   event.preventDefault(); next = Math.max(this.min(), next - big); break;
      default: return;
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

  protected onBlur(): void { this._onTouched(); }

  private setFromClientX(clientX: number): void {
    const rect  = this.trackRef.nativeElement.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw   = this.min() + ratio * (this.max() - this.min());
    const snapped = Math.round(raw / this.step()) * this.step();
    this.commit(Math.max(this.min(), Math.min(this.max(), snapped)));
  }

  private commit(v: number): void {
    const rounded = Math.round(v * 1e10) / 1e10;
    this.value.set(rounded);
    this._onChange(rounded);
  }

  writeValue(v: number): void                  { this.value.set(v ?? 0); }
  registerOnChange(fn: (v: number) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void        { this._onTouched = fn; }
  setDisabledState(isDisabled: boolean): void    { this.cvaDisabled.set(isDisabled); }
}
