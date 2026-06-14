import { screen, fireEvent, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { renderComponent, renderTemplate } from '../../../../core/testing';
import { InputOtp } from './input-otp';

function getSlots(): HTMLInputElement[] {
  return Array.from(document.querySelectorAll<HTMLInputElement>('.otp-slot'));
}

describe('InputOtp', () => {
  it('renders 6 slots by default', async () => {
    await renderComponent(InputOtp, {});
    expect(getSlots().length).toBe(6);
  });

  it('renders custom length slots', async () => {
    await renderComponent(InputOtp, { inputs: { length: 4 } });
    expect(getSlots().length).toBe(4);
  });

  it('has role="group" container with label', async () => {
    await renderComponent(InputOtp, {});
    expect(screen.getByRole('group', { name: /one-time password/i })).toBeInTheDocument();
  });

  it('each slot has an aria-label', async () => {
    await renderComponent(InputOtp, { inputs: { length: 4 } });
    expect(getSlots()[0]).toHaveAttribute('aria-label', 'Digit 1 of 4');
    expect(getSlots()[3]).toHaveAttribute('aria-label', 'Digit 4 of 4');
  });

  it('pre-fills slots from value input', async () => {
    await renderComponent(InputOtp, { inputs: { value: '123' } });
    const slots = getSlots();
    expect(slots[0].value).toBe('1');
    expect(slots[1].value).toBe('2');
    expect(slots[2].value).toBe('3');
    expect(slots[3].value).toBe('');
  });

  it('typing a digit updates the value', async () => {
    const user = userEvent.setup();
    await renderComponent(InputOtp, {});
    const slots = getSlots();
    await user.type(slots[0], '5');
    expect(slots[0].value).toBe('5');
  });

  it('typing advances focus to the next slot', async () => {
    const user = userEvent.setup();
    await renderComponent(InputOtp, {});
    const slots = getSlots();
    slots[0].focus();
    await user.keyboard('3');
    expect(document.activeElement).toBe(slots[1]);
  });

  it('Backspace on filled slot clears it', async () => {
    const user = userEvent.setup();
    await renderComponent(InputOtp, { inputs: { value: '123456' } });
    const slots = getSlots();
    slots[2].focus();
    await user.keyboard('{Backspace}');
    expect(slots[2].value).toBe('');
  });

  it('Backspace on empty slot moves focus back', async () => {
    const user = userEvent.setup();
    await renderComponent(InputOtp, { inputs: { value: '12' } });
    const slots = getSlots();
    slots[2].focus();
    await user.keyboard('{Backspace}');
    expect(document.activeElement).toBe(slots[1]);
  });

  it('ArrowRight moves focus forward', async () => {
    const user = userEvent.setup();
    await renderComponent(InputOtp, {});
    const slots = getSlots();
    slots[0].focus();
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(slots[1]);
  });

  it('ArrowLeft moves focus back', async () => {
    const user = userEvent.setup();
    await renderComponent(InputOtp, {});
    const slots = getSlots();
    slots[2].focus();
    await user.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(slots[1]);
  });

  it('marks filled slots with data-filled', async () => {
    await renderComponent(InputOtp, { inputs: { value: '123' } });
    const slots = getSlots();
    expect(slots[0]).toHaveAttribute('data-filled');
    expect(slots[1]).toHaveAttribute('data-filled');
    expect(slots[2]).toHaveAttribute('data-filled');
    expect(slots[3]).not.toHaveAttribute('data-filled');
  });

  it('sets aria-disabled when disabled', async () => {
    await renderComponent(InputOtp, { inputs: { disabled: true } });
    getSlots().forEach((s) => expect(s).toHaveAttribute('aria-disabled'));
  });

  it('sets data-disabled on host when disabled', async () => {
    await renderTemplate(`<mui-input-otp [disabled]="true"></mui-input-otp>`, {
      imports: [InputOtp],
    });
    expect(document.querySelector('mui-input-otp')).toHaveAttribute('data-disabled');
  });

  it('has inputmode="numeric" on every slot', async () => {
    await renderComponent(InputOtp, {});
    getSlots().forEach((s) => expect(s).toHaveAttribute('inputmode', 'numeric'));
  });

  it('has autocomplete="one-time-code" on every slot', async () => {
    await renderComponent(InputOtp, {});
    getSlots().forEach((s) => expect(s).toHaveAttribute('autocomplete', 'one-time-code'));
  });

  function fakePaste(slot: HTMLInputElement, text: string): void {
    const event = Object.assign(new Event('paste', { bubbles: true }), {
      clipboardData: { getData: () => text },
    }) as unknown as ClipboardEvent;
    fireEvent(slot, event);
  }

  it('paste fills slots from the pasted position', async () => {
    await renderComponent(InputOtp, {});
    const slots = getSlots();
    fakePaste(slots[0], '4567');
    expect(slots[0].value).toBe('4');
    expect(slots[1].value).toBe('5');
    expect(slots[2].value).toBe('6');
    expect(slots[3].value).toBe('7');
    expect(slots[4].value).toBe('');
  });

  it('paste ignores non-digits', async () => {
    await renderComponent(InputOtp, {});
    const slots = getSlots();
    fakePaste(slots[0], 'AB1C2');
    expect(slots[0].value).toBe('1');
    expect(slots[1].value).toBe('2');
    expect(slots[2].value).toBe('');
  });

  it('sets slots via CVA writeValue', async () => {
    const ctrl = new FormControl('654321');
    await renderTemplate(`<mui-input-otp [formControl]="ctrl" />`, {
      imports: [InputOtp, ReactiveFormsModule],
      componentProperties: { ctrl },
    });
    const slots = getSlots();
    expect(slots[0].value).toBe('6');
    expect(slots[5].value).toBe('1');
  });

  it('marks form control as touched on blur', async () => {
    const ctrl = new FormControl('');
    await renderTemplate(`<mui-input-otp [formControl]="ctrl" />`, {
      imports: [InputOtp, ReactiveFormsModule],
      componentProperties: { ctrl },
    });
    getSlots()[0].focus();
    getSlots()[0].blur();
    expect(ctrl.touched).toBe(true);
  });

  it('CVA setDisabledState disables the component', async () => {
    const ctrl = new FormControl({ value: '', disabled: true });
    await renderTemplate(`<mui-input-otp [formControl]="ctrl" />`, {
      imports: [InputOtp, ReactiveFormsModule],
      componentProperties: { ctrl },
    });
    expect(document.querySelector('mui-input-otp')).toHaveAttribute('data-disabled');
  });

  it('B-3: reacts to [value] signal input changes after init', async () => {
    const otp = signal('123456');
    await renderTemplate(`<mui-input-otp [value]="otp()" />`, {
      imports: [InputOtp],
      componentProperties: { otp },
    });
    expect(getSlots()[0].value).toBe('1');
    otp.set('789000');
    await waitFor(() => expect(getSlots()[0].value).toBe('7'));
    expect(getSlots()[1].value).toBe('8');
  });

  it('B-4: resizes slots when length changes in CVA mode without losing existing content', async () => {
    const ctrl = new FormControl('12345678');
    await renderTemplate(`<mui-input-otp [formControl]="ctrl" [length]="len" />`, {
      imports: [InputOtp, ReactiveFormsModule],
      componentProperties: { ctrl, len: 8 },
    });
    expect(getSlots().length).toBe(8);
    expect(getSlots()[0].value).toBe('1');
  });
});
