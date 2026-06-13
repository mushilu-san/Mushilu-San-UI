import { screen, fireEvent } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderComponent, renderTemplate } from '../../../../core/testing';
import { DatePicker } from './date-picker';

describe('DatePicker', () => {
  it('renders a trigger button', async () => {
    await renderComponent(DatePicker, {});
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows placeholder when no date selected', async () => {
    await renderComponent(DatePicker, { inputs: { placeholder: 'Choose date' } });
    expect(screen.getByRole('button')).toHaveTextContent('Choose date');
  });

  it('shows formatted date when value is set', async () => {
    await renderComponent(DatePicker, { inputs: { value: new Date(2024, 0, 15) } });
    const btn = screen.getByRole('button');
    expect(btn.textContent).toContain('2024');
    expect(btn.textContent).toContain('15');
  });

  it('opens calendar on trigger click', async () => {
    const user = userEvent.setup();
    await renderComponent(DatePicker, {});
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('has aria-expanded="false" when closed', async () => {
    await renderComponent(DatePicker, {});
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('has aria-expanded="true" when open', async () => {
    const user = userEvent.setup();
    await renderComponent(DatePicker, {});
    const trigger = screen.getByRole('button', { name: /pick a date/i });
    await user.click(trigger);
    // Re-query by name since many buttons now exist after calendar renders
    expect(screen.getByRole('button', { name: /pick a date/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('closes calendar on second trigger click', async () => {
    const user = userEvent.setup();
    await renderComponent(DatePicker, {});
    const trigger = screen.getByRole('button', { name: /pick a date/i });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: /pick a date/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('selects a date when calendar day is clicked', async () => {
    const user = userEvent.setup();
    await renderComponent(DatePicker, { inputs: { value: new Date(2024, 0, 1) } });
    await user.click(screen.getByRole('button'));
    const dayBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('button.cal-day'));
    const day15 = dayBtns.find(
      (b) => b.textContent?.trim() === '15' && !b.hasAttribute('data-outside'),
    );
    expect(day15).toBeTruthy();
    await user.click(day15!);
    // Panel should close
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    await renderComponent(DatePicker, {});
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not open when disabled', async () => {
    await renderComponent(DatePicker, { inputs: { disabled: true } });
    // pointer-events:none blocks userEvent — use fireEvent to test click is blocked
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('sets data-disabled on host when disabled', async () => {
    await renderTemplate(`<mui-date-picker [disabled]="true"></mui-date-picker>`, {
      imports: [DatePicker],
    });
    expect(document.querySelector('mui-date-picker')).toHaveAttribute('data-disabled');
  });

  it('trigger has aria-haspopup="dialog"', async () => {
    await renderComponent(DatePicker, {});
    expect(screen.getByRole('button')).toHaveAttribute('aria-haspopup', 'dialog');
  });
});
