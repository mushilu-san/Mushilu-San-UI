import { screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Textarea } from './textarea';

describe('Textarea (muiTextarea directive)', () => {
  it('renders a textarea element', async () => {
    await renderTemplate('<textarea muiTextarea></textarea>', { imports: [Textarea] });
    expect(document.querySelector('textarea')).toBeTruthy();
  });

  it('defaults to md size', async () => {
    await renderTemplate('<textarea muiTextarea></textarea>', { imports: [Textarea] });
    expect(document.querySelector('textarea')).toHaveAttribute('data-size', 'md');
  });

  it('sets data-size attribute', async () => {
    await renderTemplate('<textarea muiTextarea size="sm"></textarea>', { imports: [Textarea] });
    expect(document.querySelector('textarea')).toHaveAttribute('data-size', 'sm');
  });

  it('defaults to outline variant', async () => {
    await renderTemplate('<textarea muiTextarea></textarea>', { imports: [Textarea] });
    expect(document.querySelector('textarea')).toHaveAttribute('data-variant', 'outline');
  });

  it('defaults to vertical resize', async () => {
    await renderTemplate('<textarea muiTextarea></textarea>', { imports: [Textarea] });
    expect(document.querySelector('textarea')).toHaveAttribute('data-resize', 'vertical');
  });

  it('sets data-resize attribute', async () => {
    await renderTemplate('<textarea muiTextarea resize="none"></textarea>', { imports: [Textarea] });
    expect(document.querySelector('textarea')).toHaveAttribute('data-resize', 'none');
  });

  it('does not set data-invalid by default', async () => {
    await renderTemplate('<textarea muiTextarea></textarea>', { imports: [Textarea] });
    expect(document.querySelector('textarea')).not.toHaveAttribute('data-invalid');
  });

  it('sets data-invalid when invalid=true', async () => {
    await renderTemplate('<textarea muiTextarea invalid></textarea>', { imports: [Textarea] });
    expect(document.querySelector('textarea')).toHaveAttribute('data-invalid');
  });

  it('is accessible via role=textbox', async () => {
    await renderTemplate('<textarea muiTextarea aria-label="Message"></textarea>', { imports: [Textarea] });
    expect(screen.getByRole('textbox', { name: 'Message' })).toBeInTheDocument();
  });
});
