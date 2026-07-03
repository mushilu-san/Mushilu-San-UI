import { screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderComponent } from '../../../../core/testing';
import { CommandSeparator } from './command-separator';

describe('CommandSeparator', () => {
  it('renders with role=separator', async () => {
    await renderComponent(CommandSeparator);
    expect(screen.getByRole('separator', { hidden: true })).toBeInTheDocument();
  });

  it('is aria-hidden so it is not announced by screen readers', async () => {
    await renderComponent(CommandSeparator);
    expect(screen.getByRole('separator', { hidden: true })).toHaveAttribute('aria-hidden', 'true');
  });

  it('exposes part="separator"', async () => {
    await renderComponent(CommandSeparator);
    expect(screen.getByRole('separator', { hidden: true })).toHaveAttribute('part', 'separator');
  });
});
