import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { InputOtp } from './input-otp';

async function setup(dir: 'rtl' | 'ltr') {
  await renderTemplate(`<div dir="${dir}"><mui-input-otp [length]="4"></mui-input-otp></div>`, {
    imports: [InputOtp],
  });
  return Array.from(document.querySelectorAll<HTMLInputElement>('input'));
}

describe('InputOtp RTL', () => {
  it('H-B-785f23: ArrowLeft moves to the next slot in RTL', async () => {
    const user = userEvent.setup();
    const slots = await setup('rtl');
    slots[1]?.focus();
    await user.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(slots[2]);
  });

  it('H-B-785f23: ArrowRight moves to the previous slot in RTL', async () => {
    const user = userEvent.setup();
    const slots = await setup('rtl');
    slots[2]?.focus();
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(slots[1]);
  });

  it('H-B-785f23: no movement past the ends in RTL', async () => {
    const user = userEvent.setup();
    const slots = await setup('rtl');
    slots[0]?.focus();
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(slots[0]);
    slots[3]?.focus();
    await user.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(slots[3]);
  });

  it('H-B-785f23: LTR mapping unchanged', async () => {
    const user = userEvent.setup();
    const slots = await setup('ltr');
    slots[1]?.focus();
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(slots[2]);
  });
});
