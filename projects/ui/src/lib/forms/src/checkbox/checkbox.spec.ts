import { screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Checkbox } from './checkbox';

describe('Checkbox (muiCheckbox directive)', () => {
  it('renders a checkbox input', async () => {
    await renderTemplate('<input type="checkbox" muiCheckbox />', { imports: [Checkbox] });
    expect(document.querySelector('input[type=checkbox]')).toBeTruthy();
  });

  it('is accessible via role=checkbox', async () => {
    await renderTemplate('<input type="checkbox" muiCheckbox aria-label="Accept terms" />', { imports: [Checkbox] });
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeInTheDocument();
  });

  it('defaults to md size', async () => {
    await renderTemplate('<input type="checkbox" muiCheckbox />', { imports: [Checkbox] });
    expect(document.querySelector('input')).toHaveAttribute('data-size', 'md');
  });

  it('sets data-size attribute', async () => {
    await renderTemplate('<input type="checkbox" muiCheckbox size="lg" />', { imports: [Checkbox] });
    expect(document.querySelector('input')).toHaveAttribute('data-size', 'lg');
  });

  it('does not set data-invalid by default', async () => {
    await renderTemplate('<input type="checkbox" muiCheckbox />', { imports: [Checkbox] });
    expect(document.querySelector('input')).not.toHaveAttribute('data-invalid');
  });

  it('sets data-invalid when invalid=true', async () => {
    await renderTemplate('<input type="checkbox" muiCheckbox invalid />', { imports: [Checkbox] });
    expect(document.querySelector('input')).toHaveAttribute('data-invalid');
  });

});
