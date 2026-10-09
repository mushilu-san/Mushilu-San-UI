import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Calendar } from './calendar';

async function focusedDayAfter(key: string, dir: 'rtl' | 'ltr'): Promise<string | undefined> {
  const user = userEvent.setup();
  await renderTemplate(`<div dir="${dir}"><mui-calendar [value]="date"></mui-calendar></div>`, {
    imports: [Calendar],
    componentProperties: { date: new Date(2024, 0, 15) },
  });
  const focused = document.querySelector<HTMLElement>('.cal-day[tabindex="0"]');
  focused?.focus();
  await user.keyboard(key);
  return document.querySelector<HTMLElement>('.cal-day[tabindex="0"]')?.textContent?.trim();
}

describe('Calendar RTL', () => {
  it('H-B-dad290: ArrowLeft moves to the next day in RTL', async () => {
    expect(await focusedDayAfter('{ArrowLeft}', 'rtl')).toBe('16');
  });

  it('H-B-dad290: ArrowRight moves to the previous day in RTL', async () => {
    expect(await focusedDayAfter('{ArrowRight}', 'rtl')).toBe('14');
  });

  it('H-B-dad290: ArrowRight still moves to the next day in LTR', async () => {
    expect(await focusedDayAfter('{ArrowRight}', 'ltr')).toBe('16');
  });
});
