import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { useCva } from './use-cva';

function setup(initialDisabled = false) {
  const disabled = signal(initialDisabled);
  const cva = TestBed.runInInjectionContext(() => useCva<string>(disabled));
  return { disabled, cva };
}

describe('useCva', () => {
  it('H-U-0cca44: starts enabled with no-op callbacks', () => {
    const { cva } = setup();
    expect(cva.cvaDisabled()).toBe(false);
    expect(cva.isDisabled()).toBe(false);
    expect(() => {
      cva.onChange('x');
      cva.onTouched();
    }).not.toThrow();
  });

  it('H-U-0cca44: isDisabled reflects the input signal', () => {
    const { cva, disabled } = setup();
    disabled.set(true);
    expect(cva.isDisabled()).toBe(true);
    disabled.set(false);
    expect(cva.isDisabled()).toBe(false);
  });

  it('H-U-0cca44: setDisabledState drives cvaDisabled and isDisabled', () => {
    const { cva } = setup();
    cva.setDisabledState(true);
    expect(cva.cvaDisabled()).toBe(true);
    expect(cva.isDisabled()).toBe(true);
    cva.setDisabledState(false);
    expect(cva.isDisabled()).toBe(false);
  });

  it('H-U-0cca44: isDisabled is true if either source is disabled', () => {
    const { cva, disabled } = setup(true);
    cva.setDisabledState(false);
    expect(cva.isDisabled()).toBe(true);
    disabled.set(false);
    cva.setDisabledState(true);
    expect(cva.isDisabled()).toBe(true);
  });

  it('H-U-0cca44: registerOnChange replaces onChange', () => {
    const { cva } = setup();
    const fn = vi.fn();
    cva.registerOnChange(fn);
    cva.onChange('hello');
    expect(fn).toHaveBeenCalledWith('hello');
  });

  it('H-U-0cca44: registerOnTouched replaces onTouched', () => {
    const { cva } = setup();
    const fn = vi.fn();
    cva.registerOnTouched(fn);
    cva.onTouched();
    expect(fn).toHaveBeenCalledOnce();
  });
});
