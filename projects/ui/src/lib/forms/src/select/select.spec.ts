import { screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Select } from './select';

describe('Select (muiSelect directive)', () => {
  it('renders a select element', async () => {
    await renderTemplate('<select muiSelect><option>A</option></select>', { imports: [Select] });
    expect(document.querySelector('select')).toBeTruthy();
  });

  it('is accessible via role=combobox', async () => {
    await renderTemplate('<select muiSelect aria-label="Country"><option>US</option></select>', {
      imports: [Select],
    });
    expect(screen.getByRole('combobox', { name: 'Country' })).toBeInTheDocument();
  });

  it('defaults to md size', async () => {
    await renderTemplate('<select muiSelect><option>A</option></select>', { imports: [Select] });
    expect(document.querySelector('select')).toHaveAttribute('data-size', 'md');
  });

  it('sets data-size attribute', async () => {
    await renderTemplate('<select muiSelect size="lg"><option>A</option></select>', {
      imports: [Select],
    });
    expect(document.querySelector('select')).toHaveAttribute('data-size', 'lg');
  });

  it('defaults to outline variant', async () => {
    await renderTemplate('<select muiSelect><option>A</option></select>', { imports: [Select] });
    expect(document.querySelector('select')).toHaveAttribute('data-variant', 'outline');
  });

  it('does not set data-invalid by default', async () => {
    await renderTemplate('<select muiSelect><option>A</option></select>', { imports: [Select] });
    expect(document.querySelector('select')).not.toHaveAttribute('data-invalid');
  });

  it('sets data-invalid when invalid=true', async () => {
    await renderTemplate('<select muiSelect invalid><option>A</option></select>', {
      imports: [Select],
    });
    expect(document.querySelector('select')).toHaveAttribute('data-invalid');
  });
});
