import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderComponent } from '../../../../core/testing';
import { Calendar } from './calendar';

describe('Calendar', () => {
  it('renders a grid', async () => {
    await renderComponent(Calendar, {});
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('shows 7 column headers', async () => {
    await renderComponent(Calendar, {});
    expect(document.querySelectorAll('[role="columnheader"]').length).toBe(7);
  });

  it('shows 42 gridcells (6 weeks × 7)', async () => {
    await renderComponent(Calendar, {});
    expect(document.querySelectorAll('[role="gridcell"]').length).toBe(42);
  });

  it('marks today with aria-current="date"', async () => {
    await renderComponent(Calendar, {});
    expect(document.querySelector('[aria-current="date"]')).toBeTruthy();
  });

  it('has prev and next month buttons', async () => {
    await renderComponent(Calendar, {});
    expect(screen.getByRole('button', { name: /previous month/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next month/i })).toBeInTheDocument();
  });

  it('shows the heading for current month', async () => {
    await renderComponent(Calendar, { inputs: { value: new Date(2024, 0, 1) } });
    // January 2024 should appear in the heading
    expect(screen.getByRole('heading')).toBeInTheDocument();
    expect(screen.getByRole('heading').textContent).toContain('2024');
  });

  it('marks the selected date with aria-selected', async () => {
    await renderComponent(Calendar, { inputs: { value: new Date(2024, 0, 15) } });
    expect(document.querySelector('[aria-selected="true"]')).toBeTruthy();
  });

  it('outside-month days have aria-disabled', async () => {
    await renderComponent(Calendar, { inputs: { value: new Date(2024, 0, 15) } });
    const outsideDays = document.querySelectorAll('[data-outside]');
    expect(outsideDays.length).toBeGreaterThan(0);
    outsideDays.forEach((d) => expect(d).toHaveAttribute('aria-disabled'));
  });

  it('clicking a day selects it', async () => {
    await renderComponent(Calendar, { inputs: { value: new Date(2024, 0, 1) } });
    const dayBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('button.cal-day'));
    const day15 = dayBtns.find(
      (b) => b.textContent?.trim() === '15' && !b.hasAttribute('data-outside'),
    );
    expect(day15).toBeTruthy();
    fireEvent.click(day15!);
    expect(day15).toHaveAttribute('aria-selected', 'true');
  });

  it('ArrowRight moves focus to next day', async () => {
    const user = userEvent.setup();
    await renderComponent(Calendar, { inputs: { value: new Date(2024, 0, 15) } });
    const focused = document.querySelector<HTMLElement>('.cal-day[tabindex="0"]');
    expect(focused?.textContent?.trim()).toBe('15');
    focused?.focus();
    await user.keyboard('{ArrowRight}');
    const newFocused = document.querySelector<HTMLElement>('.cal-day[tabindex="0"]');
    expect(newFocused?.textContent?.trim()).toBe('16');
  });

  it('ArrowLeft moves focus to previous day', async () => {
    const user = userEvent.setup();
    await renderComponent(Calendar, { inputs: { value: new Date(2024, 0, 15) } });
    const focused = document.querySelector<HTMLElement>('.cal-day[tabindex="0"]');
    focused?.focus();
    await user.keyboard('{ArrowLeft}');
    const newFocused = document.querySelector<HTMLElement>('.cal-day[tabindex="0"]');
    expect(newFocused?.textContent?.trim()).toBe('14');
  });

  it('Home moves focus to start of week (Sunday)', async () => {
    const user = userEvent.setup();
    await renderComponent(Calendar, { inputs: { value: new Date(2024, 0, 17) } }); // Wednesday
    const focused = document.querySelector<HTMLElement>('.cal-day[tabindex="0"]');
    focused?.focus();
    await user.keyboard('{Home}');
    const newFocused = document.querySelector<HTMLElement>('.cal-day[tabindex="0"]');
    expect(newFocused?.textContent?.trim()).toBe('14'); // Sunday Jan 14
  });

  it('End moves focus to end of week (Saturday)', async () => {
    const user = userEvent.setup();
    await renderComponent(Calendar, { inputs: { value: new Date(2024, 0, 17) } }); // Wednesday
    const focused = document.querySelector<HTMLElement>('.cal-day[tabindex="0"]');
    focused?.focus();
    await user.keyboard('{End}');
    const newFocused = document.querySelector<HTMLElement>('.cal-day[tabindex="0"]');
    expect(newFocused?.textContent?.trim()).toBe('20'); // Saturday Jan 20
  });

  it('does not select disabled (minDate-blocked) day', async () => {
    const min = new Date(2024, 0, 10);
    await renderComponent(Calendar, {
      inputs: { value: new Date(2024, 0, 15), minDate: min },
    });
    // Day 5 should be disabled
    const dayBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('button.cal-day'));
    const day5 = dayBtns.find(
      (b) => b.textContent?.trim() === '5' && !b.hasAttribute('data-outside'),
    );
    expect(day5).toBeTruthy();
    expect(day5).toHaveAttribute('aria-disabled');
  });

  it('clicking prev month button shows previous month', async () => {
    const user = userEvent.setup();
    await renderComponent(Calendar, { inputs: { value: new Date(2024, 1, 15) } }); // Feb 2024
    await user.click(screen.getByRole('button', { name: /previous month/i }));
    // View should now be January 2024
    expect(screen.getByRole('heading').textContent).toContain('January');
  });

  it('clicking next month button shows next month', async () => {
    const user = userEvent.setup();
    await renderComponent(Calendar, { inputs: { value: new Date(2024, 0, 15) } }); // Jan 2024
    await user.click(screen.getByRole('button', { name: /next month/i }));
    expect(screen.getByRole('heading').textContent).toContain('February');
  });

  it('prevMonth wraps December to January and decrements year', async () => {
    const user = userEvent.setup();
    await renderComponent(Calendar, { inputs: { value: new Date(2024, 0, 15) } }); // Jan 2024
    await user.click(screen.getByRole('button', { name: /previous month/i }));
    // Should now show December 2023
    expect(screen.getByRole('heading').textContent).toContain('2023');
    expect(screen.getByRole('heading').textContent).toContain('December');
  });

  it('nextMonth wraps December to January and increments year', async () => {
    const user = userEvent.setup();
    await renderComponent(Calendar, { inputs: { value: new Date(2024, 11, 15) } }); // Dec 2024
    await user.click(screen.getByRole('button', { name: /next month/i }));
    expect(screen.getByRole('heading').textContent).toContain('2025');
    expect(screen.getByRole('heading').textContent).toContain('January');
  });

  it('PageUp moves view to previous month', async () => {
    const user = userEvent.setup();
    await renderComponent(Calendar, { inputs: { value: new Date(2024, 1, 15) } }); // Feb 2024
    const focused = document.querySelector<HTMLElement>('.cal-day[tabindex="0"]');
    focused?.focus();
    await user.keyboard('{PageUp}');
    // View should now show January
    expect(screen.getByRole('heading').textContent).toContain('January');
  });

  it('PageDown moves view to next month', async () => {
    const user = userEvent.setup();
    await renderComponent(Calendar, { inputs: { value: new Date(2024, 0, 15) } }); // Jan 2024
    const focused = document.querySelector<HTMLElement>('.cal-day[tabindex="0"]');
    focused?.focus();
    await user.keyboard('{PageDown}');
    expect(screen.getByRole('heading').textContent).toContain('February');
  });

  it('maxDate disables days after the maximum', async () => {
    const max = new Date(2024, 0, 20);
    await renderComponent(Calendar, {
      inputs: { value: new Date(2024, 0, 15), maxDate: max },
    });
    const dayBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('button.cal-day'));
    const day25 = dayBtns.find(
      (b) => b.textContent?.trim() === '25' && !b.hasAttribute('data-outside'),
    );
    expect(day25).toBeTruthy();
    expect(day25).toHaveAttribute('aria-disabled');
  });

  it('registerOnTouched callback fires when a day is selected', async () => {
    const { fixture } = await renderComponent(Calendar, {
      inputs: { value: new Date(2024, 0, 15) },
    });
    const onTouched = vi.fn();
    fixture.componentInstance.registerOnTouched(onTouched);
    const dayBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('button.cal-day'));
    const day10 = dayBtns.find(
      (b) => b.textContent?.trim() === '10' && !b.hasAttribute('data-outside'),
    );
    fireEvent.click(day10!);
    expect(onTouched).toHaveBeenCalled();
  });

  it('setDisabledState(true) prevents key navigation', async () => {
    const user = userEvent.setup();
    const { fixture, detectChanges } = await renderComponent(Calendar, {
      inputs: { value: new Date(2024, 0, 15) },
    });
    fixture.componentInstance.setDisabledState(true);
    detectChanges();
    const focused = document.querySelector<HTMLElement>('.cal-day[tabindex="0"]');
    focused?.focus();
    await user.keyboard('{ArrowRight}');
    // focusedDate unchanged → tabindex="0" stays on day 15
    const stillFocused = document.querySelector<HTMLElement>('.cal-day[tabindex="0"]');
    expect(stillFocused?.textContent?.trim()).toBe('15');
  });
});
