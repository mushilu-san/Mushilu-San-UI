import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  WritableSignal,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'mui-input-otp',
  standalone: true,
  templateUrl: './input-otp.html',
  styleUrl: './input-otp.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputOtp),
      multi: true,
    },
  ],
  host: {
    '[attr.data-disabled]': 'isDisabled() || null',
    '[attr.part]': '"root"',
  },
})
export class InputOtp implements ControlValueAccessor {
  length = input(6, { transform: numberAttribute });
  disabled = input(false, { transform: booleanAttribute });
  /** Initial / externally controlled value. Use [(value)] for two-way binding. */
  value = input('');
  valueChange = output<string>();

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly _cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this._cvaDisabled());

  /* Positional internal state — mutated directly by user interactions */
  private readonly _slotsData: WritableSignal<string[]> = signal([]);
  private _cvaActive = false;

  constructor() {
    /* B-3: re-seed when [value] signal input changes (template-binding, non-CVA). */
    effect(() => {
      const v = this.value();
      const len = this.length();
      if (this._cvaActive) return;
      this._slotsData.set(Array.from({ length: len }, (_, i) => v[i] ?? ''));
    });

    /* B-4: resize slots when length changes in CVA mode, preserving existing content. */
    effect(() => {
      const len = this.length();
      if (!this._cvaActive) return;
      this._slotsData.update((s) => {
        if (s.length === len) return s;
        return Array.from({ length: len }, (_, i) => s[i] ?? '');
      });
    });
  }

  protected readonly indices = computed(() => Array.from({ length: this.length() }, (_, i) => i));

  protected readonly slots = this._slotsData.asReadonly();

  private getInput(idx: number): HTMLInputElement | null {
    return (
      (this.el.nativeElement as HTMLElement).querySelectorAll<HTMLInputElement>('.otp-slot')[idx] ??
      null
    );
  }

  protected onInput(event: Event, idx: number): void {
    if (this.isDisabled()) return;
    const inp = event.currentTarget as HTMLInputElement;
    const raw = inp.value.replace(/\D/g, '');
    const char = raw ? raw[raw.length - 1] : '';

    this._slotsData.update((s) => {
      const n = [...s];
      n[idx] = char;
      return n;
    });
    inp.value = char;
    this.emit();

    if (char && idx < this.length() - 1) {
      this.getInput(idx + 1)?.focus();
    }
  }

  protected onKeydown(event: KeyboardEvent, idx: number): void {
    if (this.isDisabled()) return;

    if (event.key === 'Backspace') {
      event.preventDefault();
      if (this._slotsData()[idx]) {
        this._slotsData.update((s) => {
          const n = [...s];
          n[idx] = '';
          return n;
        });
        this.emit();
      } else if (idx > 0) {
        this._slotsData.update((s) => {
          const n = [...s];
          n[idx - 1] = '';
          return n;
        });
        this.emit();
        this.getInput(idx - 1)?.focus();
      }
    } else if (event.key === 'Delete') {
      event.preventDefault();
      this._slotsData.update((s) => {
        const n = [...s];
        n[idx] = '';
        return n;
      });
      this.emit();
    } else if (event.key === 'ArrowLeft' && idx > 0) {
      event.preventDefault();
      this.getInput(idx - 1)?.focus();
    } else if (event.key === 'ArrowRight' && idx < this.length() - 1) {
      event.preventDefault();
      this.getInput(idx + 1)?.focus();
    }
  }

  protected onFocus(idx: number): void {
    setTimeout(() => this.getInput(idx)?.select());
  }

  protected onPaste(event: ClipboardEvent, idx: number): void {
    event.preventDefault();
    const pasted = (event.clipboardData?.getData('text') ?? '')
      .replace(/\D/g, '')
      .slice(0, this.length() - idx);
    if (!pasted) return;

    this._slotsData.update((s) => {
      const n = [...s];
      for (let i = 0; i < pasted.length; i++) n[idx + i] = pasted[i];
      return n;
    });
    this.emit();
    this.getInput(Math.min(idx + pasted.length, this.length() - 1))?.focus();
  }

  private emit(): void {
    const val = this._slotsData().join('');
    this.valueChange.emit(val);
    this._onChange(val);
  }

  private _onChange: (v: string) => void = () => undefined;
  private _onTouched: () => void = () => undefined;

  protected onBlur(): void {
    this._onTouched();
  }

  writeValue(v: string): void {
    const str = v ?? '';
    this._slotsData.set(Array.from({ length: this.length() }, (_, i) => str[i] ?? ''));
  }

  registerOnChange(fn: (v: string) => void): void {
    this._cvaActive = true;
    this._onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this._cvaDisabled.set(isDisabled);
  }
}
