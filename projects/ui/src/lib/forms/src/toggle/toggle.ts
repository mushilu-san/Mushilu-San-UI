import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';
import type { ToggleSize } from './toggle.types';

@Component({
  selector: 'mui-toggle',
  standalone: true,
  templateUrl: './toggle.html',
  styleUrl: './toggle.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Toggle),
      multi: true,
    },
  ],
  host: {
    '[attr.role]': '"switch"',
    '[attr.aria-checked]': 'checked().toString()',
    '[attr.aria-disabled]': 'isDisabled() || null',
    '[attr.aria-label]': 'label() || null',
    '[attr.tabindex]': 'isDisabled() ? "-1" : "0"',
    '[attr.data-checked]': 'checked() ? "" : null',
    '[attr.data-size]': 'size()',
    '[attr.data-disabled]': 'isDisabled() || null',
    '[attr.part]': '"root"',
    '(click)': 'toggle()',
    '(keydown.space)': '$event.preventDefault(); toggle()',
    '(keydown.enter)': '$event.preventDefault(); toggle()',
    '(blur)': '_onTouched()',
  },
})
export class Toggle implements ControlValueAccessor {
  size = input<ToggleSize>('md');
  label = input<string>();
  disabled = input(false, { transform: booleanAttribute });

  checked = model(false);

  private readonly _cvaDisabled = signal(false);
  protected readonly isDisabled = (): boolean => this.disabled() || this._cvaDisabled();

  _onChange: (v: boolean) => void = () => undefined;
  _onTouched: () => void = () => undefined;

  toggle(): void {
    if (this.isDisabled()) return;
    this.checked.update((v) => !v);
    this._onChange(this.checked());
    this._onTouched();
  }

  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }
  registerOnChange(fn: (v: boolean) => void): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this._cvaDisabled.set(isDisabled);
  }
}
