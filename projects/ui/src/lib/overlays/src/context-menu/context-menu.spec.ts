import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
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

  it('openAt places the panel at the cursor position', async () => {
    await renderTemplate(BASE, { imports: IMPORTS });
    fireEvent.contextMenu(screen.getByTestId('trigger'), { clientX: 150, clientY: 250 });
    const panel = screen.getByRole('menu');
    expect(panel.style.left).toBe('150px');
    expect(panel.style.top).toBe('250px');
  });

  describe('viewport clamping', () => {
    afterEach(() => vi.restoreAllMocks());

    it('H-C-a640a4: clamps near the viewport edge and re-clamps on resize', async () => {
      vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(200);
      vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(100);
      await renderTemplate(BASE, { imports: IMPORTS });
      // viewport 1024x768
      fireEvent.contextMenu(screen.getByTestId('trigger'), { clientX: 1000, clientY: 760 });
      const panel = screen.getByRole('menu');
      expect(panel.style.left).toBe('820px'); // 1024 - 200 - 4
      expect(panel.style.top).toBe('664px'); // 768 - 100 - 4

      const innerWidth = window.innerWidth;
      Object.defineProperty(window, 'innerWidth', { value: 600, configurable: true });
      window.dispatchEvent(new Event('resize'));
      expect(panel.style.left).toBe('396px'); // 600 - 200 - 4
      Object.defineProperty(window, 'innerWidth', { value: innerWidth, configurable: true });
    });
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

  it('H-E-fd6a0a: Escape closes the menu even when a menu item (inside the panel) has focus', async () => {
    // The panel stops propagation for every other key to keep keystrokes from
    // leaking to the page — Escape dispatched from *inside* the panel must be
    // carved out, or it never reaches the document-level close handler.
    await renderTemplate(BASE, { imports: IMPORTS });
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    const item = screen.getByRole('menuitem', { name: 'Edit' });
    item.focus();
    fireEvent.keyDown(item, { key: 'Escape' });
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

  it('H-T-6d1f7c: closeOnSelect works as HTML attribute without binding', async () => {
    const user = userEvent.setup();
    await renderTemplate(
      `<mui-context-menu closeOnSelect>
        <div muiContextMenuTrigger data-testid="t">T</div>
        <mui-context-menu-item>Edit</mui-context-menu-item>
      </mui-context-menu>`,
      { imports: IMPORTS },
    );
    fireEvent.contextMenu(screen.getByTestId('t'));
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('H-E-fd6a0a: Escape returns focus to whatever was focused before the menu opened', async () => {
    await renderTemplate(
      `<button data-testid="page-btn">Elsewhere</button>
      <mui-context-menu>
        <div muiContextMenuTrigger data-testid="trigger" style="width:200px;height:100px;">Trigger</div>
        <mui-context-menu-item>Edit</mui-context-menu-item>
      </mui-context-menu>`,
      { imports: IMPORTS },
    );
    const pageBtn = screen.getByTestId('page-btn');
    pageBtn.focus();
    // Focus is captured on pointerdown (before the browser's mousedown-driven
    // blur runs) — real right-clicks always fire pointerdown first.
    fireEvent.pointerDown(screen.getByTestId('trigger'));
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    screen.getByRole('menuitem', { name: 'Edit' }).focus();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.activeElement).toBe(pageBtn);
  });

  it('touchstart with empty touches does not throw (B-2)', async () => {
    await renderTemplate(BASE, { imports: IMPORTS });
    const trigger = screen.getByTestId('trigger');
    // Synthetic/assistive touchstart can arrive with an empty touches list.
    expect(() => fireEvent.touchStart(trigger, { touches: [] })).not.toThrow();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
