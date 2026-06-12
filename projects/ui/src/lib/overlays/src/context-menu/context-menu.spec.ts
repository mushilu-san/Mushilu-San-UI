import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { ContextMenu } from './context-menu';
import { ContextMenuItem } from './context-menu-item';
import { ContextMenuSeparator } from './context-menu-separator';
import { ContextMenuTrigger } from './context-menu-trigger';

const IMPORTS = [ContextMenu, ContextMenuTrigger, ContextMenuItem, ContextMenuSeparator];

const BASE = `
  <mui-context-menu>
    <div muiContextMenuTrigger data-testid="trigger" style="width:200px;height:100px;">Trigger</div>
    <mui-context-menu-item>Edit</mui-context-menu-item>
    <mui-context-menu-separator />
    <mui-context-menu-item color="danger">Delete</mui-context-menu-item>
  </mui-context-menu>
`;

describe('ContextMenu', () => {
  it('panel is hidden by default', async () => {
    await renderTemplate(BASE, { imports: IMPORTS });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens on contextmenu event', async () => {
    await renderTemplate(BASE, { imports: IMPORTS });
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('renders menu items', async () => {
    await renderTemplate(BASE, { imports: IMPORTS });
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();
  });

  it('closes when item is selected', async () => {
    const user = userEvent.setup();
    await renderTemplate(BASE, { imports: IMPORTS });
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('emits selected output on item click', async () => {
    const user = userEvent.setup();
    const onSelected = vi.fn();
    await renderTemplate(
      `<mui-context-menu>
        <div muiContextMenuTrigger data-testid="t">T</div>
        <mui-context-menu-item (selected)="onSelected()">Edit</mui-context-menu-item>
      </mui-context-menu>`,
      { imports: IMPORTS, componentProperties: { onSelected } },
    );
    fireEvent.contextMenu(screen.getByTestId('t'));
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(onSelected).toHaveBeenCalledOnce();
  });

  it('does not select disabled item', async () => {
    const onSelected = vi.fn();
    await renderTemplate(
      `<mui-context-menu>
        <div muiContextMenuTrigger data-testid="t">T</div>
        <mui-context-menu-item [disabled]="true" (selected)="onSelected()">Edit</mui-context-menu-item>
      </mui-context-menu>`,
      { imports: IMPORTS, componentProperties: { onSelected } },
    );
    fireEvent.contextMenu(screen.getByTestId('t'));
    const btn = screen.getByRole('menuitem', { name: 'Edit' });
    btn.click();
    expect(onSelected).not.toHaveBeenCalled();
  });

  it('danger item has data-color=danger', async () => {
    await renderTemplate(BASE, { imports: IMPORTS });
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute('data-color', 'danger');
  });

  it('panel has role=menu', async () => {
    await renderTemplate(BASE, { imports: IMPORTS });
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});
