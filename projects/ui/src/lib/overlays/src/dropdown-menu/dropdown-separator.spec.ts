import { screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { DropdownSeparator } from './dropdown-separator';

describe('DropdownSeparator', () => {
  it('renders with the implicit separator role', async () => {
    await renderTemplate('<mui-dropdown-separator />', { imports: [DropdownSeparator] });
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('exposes part="separator" for styling hooks', async () => {
    await renderTemplate('<mui-dropdown-separator />', { imports: [DropdownSeparator] });
    expect(screen.getByRole('separator')).toHaveAttribute('part', 'separator');
  });

  it('renders as an <hr> element', async () => {
    await renderTemplate('<mui-dropdown-separator />', { imports: [DropdownSeparator] });
    expect(document.querySelector('mui-dropdown-separator hr')).toBeInTheDocument();
  });
});
