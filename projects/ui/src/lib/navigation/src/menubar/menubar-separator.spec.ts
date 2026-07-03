import { screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderComponent } from '../../../../core/testing';
import { MenubarSeparator } from './menubar-separator';

describe('MenubarSeparator (isolated)', () => {
  it('renders with role=separator', async () => {
    await renderComponent(MenubarSeparator);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('exposes part="separator"', async () => {
    await renderComponent(MenubarSeparator);
    expect(screen.getByRole('separator')).toHaveAttribute('part', 'separator');
  });
});
