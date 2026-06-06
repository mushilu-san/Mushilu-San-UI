import { screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Input } from './input';

describe('Input (muiInput directive)', () => {
  it('renders an input element', async () => {
    await renderTemplate('<input muiInput />', { imports: [Input] });
    expect(document.querySelector('input')).toBeTruthy();
  });

  it('defaults to md size', async () => {
    await renderTemplate('<input muiInput />', { imports: [Input] });
    expect(document.querySelector('input')).toHaveAttribute('data-size', 'md');
  });

  it('sets data-size attribute', async () => {
    await renderTemplate('<input muiInput size="lg" />', { imports: [Input] });
    expect(document.querySelector('input')).toHaveAttribute('data-size', 'lg');
  });

  it('defaults to outline variant', async () => {
    await renderTemplate('<input muiInput />', { imports: [Input] });
    expect(document.querySelector('input')).toHaveAttribute('data-variant', 'outline');
  });

  it('sets data-variant attribute', async () => {
    await renderTemplate('<input muiInput variant="filled" />', { imports: [Input] });
    expect(document.querySelector('input')).toHaveAttribute('data-variant', 'filled');
  });

  it('does not set data-invalid by default', async () => {
    await renderTemplate('<input muiInput />', { imports: [Input] });
    expect(document.querySelector('input')).not.toHaveAttribute('data-invalid');
  });

  it('sets data-invalid when invalid=true', async () => {
    await renderTemplate('<input muiInput invalid />', { imports: [Input] });
    expect(document.querySelector('input')).toHaveAttribute('data-invalid');
  });

  it('is accessible via role=textbox', async () => {
    await renderTemplate('<input muiInput aria-label="Email" />', { imports: [Input] });
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
  });
});
