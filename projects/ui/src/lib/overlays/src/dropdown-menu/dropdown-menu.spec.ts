import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { DropdownItem } from './dropdown-item';
import { DropdownMenu } from './dropdown-menu';
import { DropdownSeparator } from './dropdown-separator';
import { DropdownTrigger } from './dropdown-trigger';

const imports = [DropdownMenu, DropdownTrigger, DropdownItem, DropdownSeparator];

const basic = `
  <mui-dropdown-menu>
    <button muiDropdownTrigger>Open</button>
    <mui-dropdown-item>Edit</mui-dropdown-item>
    <mui-dropdown-item>Duplicate</mui-dropdown-item>
    <mui-dropdown-separator />
    <mui-dropdown-item color="danger">Delete</mui-dropdown-item>
  </mui-dropdown-menu>
`;

describe('DropdownMenu', () => {
  it('panel is hidden by default', async () => {
    await renderTemplate(basic, { imports });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens panel on trigger click', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('renders menu items with menuitem role', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
  });

  it('sets aria-expanded on trigger', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    const btn = screen.getByRole('button', { name: 'Open' });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    await user.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });

  it('sets aria-haspopup="menu" on trigger', async () => {
    await renderTemplate(basic, { imports });
    expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('closes when item is clicked', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('emits itemClick on item click', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    await renderTemplate(
      `<mui-dropdown-menu>
        <button muiDropdownTrigger>Open</button>
        <mui-dropdown-item (itemClick)="handler()">Edit</mui-dropdown-item>
       </mui-dropdown-menu>`,
      { imports, componentProperties: { handler } },
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('disabled item has aria-disabled', async () => {
    const user = userEvent.setup();
    await renderTemplate(
      `<mui-dropdown-menu>
        <button muiDropdownTrigger>Open</button>
        <mui-dropdown-item disabled>Locked</mui-dropdown-item>
       </mui-dropdown-menu>`,
      { imports },
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('menuitem', { name: 'Locked' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('disabled item does not emit itemClick', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    await renderTemplate(
      `<mui-dropdown-menu>
        <button muiDropdownTrigger>Open</button>
        <mui-dropdown-item disabled (itemClick)="handler()">Locked</mui-dropdown-item>
       </mui-dropdown-menu>`,
      { imports, componentProperties: { handler } },
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    // disabled item has pointer-events:none — use fireEvent
    const { fireEvent } = await import('@testing-library/angular');
    fireEvent.click(screen.getByRole('menuitem', { name: 'Locked' }));
    expect(handler).not.toHaveBeenCalled();
  });

  it('renders a separator', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });
});
