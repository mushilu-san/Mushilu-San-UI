import { screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { CommandGroup } from './command-group';

describe('CommandGroup', () => {
  it('renders with role=group and projects content', async () => {
    await renderTemplate('<mui-command-group>Items</mui-command-group>', {
      imports: [CommandGroup],
    });
    expect(screen.getByRole('group')).toHaveTextContent('Items');
  });

  it('renders a label element and sets aria-label when label is set', async () => {
    await renderTemplate('<mui-command-group label="Actions">Items</mui-command-group>', {
      imports: [CommandGroup],
    });
    expect(screen.getByRole('group')).toHaveAttribute('aria-label', 'Actions');
    expect(document.querySelector('.mui-command-group__label')).toHaveTextContent('Actions');
  });

  it('omits the label element when label is not set', async () => {
    await renderTemplate('<mui-command-group>Items</mui-command-group>', {
      imports: [CommandGroup],
    });
    expect(document.querySelector('.mui-command-group__label')).not.toBeInTheDocument();
  });

  it('exposes part="group" on the group element', async () => {
    await renderTemplate('<mui-command-group>Items</mui-command-group>', {
      imports: [CommandGroup],
    });
    expect(screen.getByRole('group')).toHaveAttribute('part', 'group');
  });
});
