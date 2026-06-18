import { computed, type Signal, signal, type WritableSignal } from '@angular/core';

export interface CvaState<T> {
  onChange: (v: T) => void;
  onTouched: () => void;
  cvaDisabled: WritableSignal<boolean>;
  isDisabled: Signal<boolean>;
  registerOnChange(fn: (v: T) => void): void;
  registerOnTouched(fn: () => void): void;
  setDisabledState(isDisabled: boolean): void;
}

export function useCva<T>(disabled: Signal<boolean>): CvaState<T> {
  const cvaDisabled = signal(false);
  const state: CvaState<T> = {
    onChange: () => undefined,
    onTouched: () => undefined,
    cvaDisabled,
    isDisabled: computed(() => disabled() || cvaDisabled()),
    registerOnChange(fn: (v: T) => void): void {
      state.onChange = fn;
    },
    registerOnTouched(fn: () => void): void {
      state.onTouched = fn;
    },
    setDisabledState(isDisabled: boolean): void {
      cvaDisabled.set(isDisabled);
    },
  };
  return state;
}
