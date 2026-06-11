import { describe, expect, it } from 'vitest';
import { renderComponent } from '../../../../core/testing';
import { Typography } from './typography';

describe('Typography', () => {
  it('defaults to variant=p', async () => {
    const { container } = await renderComponent(Typography, { inputs: {} });
    expect(container).toHaveAttribute('data-variant', 'p');
  });

  it('sets data-variant=h1', async () => {
    const { container } = await renderComponent(Typography, { inputs: { variant: 'h1' } });
    expect(container).toHaveAttribute('data-variant', 'h1');
  });

  it('sets data-variant=muted', async () => {
    const { container } = await renderComponent(Typography, { inputs: { variant: 'muted' } });
    expect(container).toHaveAttribute('data-variant', 'muted');
  });

  it('projects content', async () => {
    const { container } = await renderComponent(Typography, { inputs: { variant: 'h1' } });
    expect(container).toHaveAttribute('data-variant', 'h1');
  });
});
