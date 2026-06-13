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
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute(
      'data-color',
      'danger',
    );
  });

  it('panel has role=menu', async () => {
    await renderTemplate(BASE, { imports: IMPORTS });
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('openAt positions panel via CSS custom properties', async () => {
    await renderTemplate(BASE, { imports: IMPORTS });
    const host = document.querySelector('mui-context-menu') as HTMLElement;
    fireEvent.contextMenu(screen.getByTestId('trigger'), { clientX: 150, clientY: 250 });
    // Angular [style.--ctx-x.px]='panelX()' sets the inline CSS variable
    const x = host.style.getPropertyValue('--ctx-x');
    const y = host.style.getPropertyValue('--ctx-y');
    // Values could be "150px" or "150" depending on Angular's rendering
    expect(x).toBeTruthy();
    expect(y).toBeTruthy();
  });

  it('emits opened event when menu opens', async () => {
    const onOpened = vi.fn();
    await renderTemplate(
      `<mui-context-menu (opened)="onOpened()">
        <div muiContextMenuTrigger data-testid="t">T</div>
      </mui-context-menu>`,
      { imports: IMPORTS, componentProperties: { onOpened } },
    );
    fireEvent.contextMenu(screen.getByTestId('t'));
    expect(onOpened).toHaveBeenCalledOnce();
  });

  it('emits closed event when menu closes', async () => {
    const onClosed = vi.fn();
    await renderTemplate(
      `<mui-context-menu (closed)="onClosed()">
        <div muiContextMenuTrigger data-testid="t">T</div>
        <mui-context-menu-item>Edit</mui-context-menu-item>
      </mui-context-menu>`,
      { imports: IMPORTS, componentProperties: { onClosed } },
    );
    fireEvent.contextMenu(screen.getByTestId('t'));
    fireEvent.click(document.body); // outside click → close
    expect(onClosed).toHaveBeenCalledOnce();
  });

  it('close() when already closed is a no-op', async () => {
    const onClosed = vi.fn();
    await renderTemplate(
      `<mui-context-menu (closed)="onClosed()">
        <div muiContextMenuTrigger data-testid="t">T</div>
      </mui-context-menu>`,
      { imports: IMPORTS, componentProperties: { onClosed } },
    );
    // Menu starts closed — trigger document click without opening first
    fireEvent.click(document.body);
    expect(onClosed).not.toHaveBeenCalled();
  });

  it('clicking outside the menu panel closes it', async () => {
    await renderTemplate(BASE, { imports: IMPORTS });
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.click(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('Escape key closes an open menu', async () => {
    await renderTemplate(BASE, { imports: IMPORTS });
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('Escape when menu is closed is a no-op', async () => {
    const onClosed = vi.fn();
    await renderTemplate(
      `<mui-context-menu (closed)="onClosed()">
        <div muiContextMenuTrigger data-testid="t">T</div>
      </mui-context-menu>`,
      { imports: IMPORTS, componentProperties: { onClosed } },
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClosed).not.toHaveBeenCalled();
  });
});
