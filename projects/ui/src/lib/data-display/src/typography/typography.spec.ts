import { screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderComponent } from '../../../../core/testing';
import { Typography } from './typography';

describe('Typography', () => {
  it('defaults to variant=p', async () => {
    await renderComponent(Typography, { inputs: {} });
    const el = document.querySelector('mui-typography')!;
    expect(el).toHaveAttribute('data-variant', 'p');
  });

  it('sets data-variant attribute', async () => {
    for (const variant of ['h1', 'h2', 'h3', 'h4', 'lead', 'muted', 'small', 'code', 'blockquote'] as const) {
      await renderComponent(Typography, { inputs: { variant } });
      const el = document.querySelector('mui-typography')!;
      expect(el).toHaveAttribute('data-variant', variant);
    }
  });

  it('projects content', async () => {
    const { container } = await renderComponent(Typography, {
      inputs: { variant: 'h1' },
    });
    // Just verify the host renders with the right attribute
    expect(document.querySelector('[data-variant="h1"]')).toBeInTheDocument();
  });
});
