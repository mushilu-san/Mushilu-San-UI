import { screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Radio } from './radio';

describe('Radio (muiRadio directive)', () => {
  it('renders a radio input', async () => {
    await renderTemplate('<input type="radio" muiRadio />', { imports: [Radio] });
    expect(document.querySelector('input[type=radio]')).toBeTruthy();
  });

  it('is accessible via role=radio', async () => {
    await renderTemplate('<input type="radio" muiRadio aria-label="Option A" />', { imports: [Radio] });
    expect(screen.getByRole('radio', { name: 'Option A' })).toBeInTheDocument();
  });

  it('defaults to md size', async () => {
    await renderTemplate('<input type="radio" muiRadio />', { imports: [Radio] });
    expect(document.querySelector('input')).toHaveAttribute('data-size', 'md');
  });

  it('sets data-size attribute', async () => {
    await renderTemplate('<input type="radio" muiRadio size="sm" />', { imports: [Radio] });
    expect(document.querySelector('input')).toHaveAttribute('data-size', 'sm');
  });

});
