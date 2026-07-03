import { screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderComponent } from '../../../../core/testing';
import { ContextMenuSeparator } from './context-menu-separator';

describe('ContextMenuSeparator', () => {
  it('renders with role=separator', async () => {
    await renderComponent(ContextMenuSeparator);
    expect(screen.getByRole('separator', { hidden: true })).toBeInTheDocument();
  });

  it('is aria-hidden so it is not announced by screen readers', async () => {
    await renderComponent(ContextMenuSeparator);
    expect(screen.getByRole('separator', { hidden: true })).toHaveAttribute('aria-hidden', 'true');
  });

  it('exposes part="separator"', async () => {
    await renderComponent(ContextMenuSeparator);
    expect(screen.getByRole('separator', { hidden: true })).toHaveAttribute('part', 'separator');
  });
});
