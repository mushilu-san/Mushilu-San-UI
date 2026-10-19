import { screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderComponent, renderTemplate } from '../../../../core/testing';
import { CommandList } from './command-list';

describe('CommandList', () => {
  it('renders with role=listbox', async () => {
    await renderTemplate('<mui-command-list></mui-command-list>', { imports: [CommandList] });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('exposes part="list"', async () => {
    await renderTemplate('<mui-command-list></mui-command-list>', { imports: [CommandList] });
    expect(screen.getByRole('listbox')).toHaveAttribute('part', 'list');
  });

  it('projects content', async () => {
    await renderTemplate(
      '<mui-command-list><div data-testid="item">Item</div></mui-command-list>',
      {
        imports: [CommandList],
      },
    );
    expect(screen.getByTestId('item')).toBeInTheDocument();
  });

  it('H-A11Y-726: names the listbox', async () => {
    await renderComponent(CommandList, { inputs: { label: 'Pages' } });
    expect(document.querySelector('[role="listbox"]')).toHaveAttribute('aria-label', 'Pages');
  });
});
