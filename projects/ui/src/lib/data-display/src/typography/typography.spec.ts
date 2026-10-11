import { describe, expect, it } from 'vitest';
import { renderComponent, renderTemplate } from '../../../../core/testing';
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

  it('H-A11Y-725: exposes heading variants as role=heading with aria-level', async () => {
    await renderTemplate('<mui-typography variant="h2">Section</mui-typography>', {
      imports: [Typography],
    });
    const el = document.querySelector('mui-typography');
    expect(el).toHaveAttribute('role', 'heading');
    expect(el).toHaveAttribute('aria-level', '2');
  });

  it('H-A11Y-725: body variants have no heading role', async () => {
    await renderTemplate('<mui-typography variant="lead">Intro</mui-typography>', {
      imports: [Typography],
    });
    expect(document.querySelector('mui-typography')).not.toHaveAttribute('role');
  });
});
