import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { CONTEXT_MENU_CONTEXT } from './context-menu';
import type { ContextMenuContext } from './context-menu';
import { ContextMenuItem } from './context-menu-item';

function makeCtx(): ContextMenuContext {
  return {
    open: vi.fn() as unknown as ContextMenuContext['open'],
    openAt: vi.fn(),
    close: vi.fn(),
    onItemSelected: vi.fn(),
  };
}

describe('ContextMenuItem', () => {
  it('renders with role=menuitem', async () => {
    await renderTemplate('<mui-context-menu-item>Edit</mui-context-menu-item>', {
      imports: [ContextMenuItem],
      providers: [{ provide: CONTEXT_MENU_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('menuitem')).toHaveTextContent('Edit');
  });

  it('emits selected and notifies ctx.onItemSelected() on click', async () => {
    const user = userEvent.setup();
    const ctx = makeCtx();
    const onSelected = vi.fn();
    await renderTemplate(
      '<mui-context-menu-item (selected)="onSelected()">Edit</mui-context-menu-item>',
      {
        imports: [ContextMenuItem],
        providers: [{ provide: CONTEXT_MENU_CONTEXT, useValue: ctx }],
        componentProperties: { onSelected },
      },
    );
    await user.click(screen.getByRole('menuitem'));
    expect(onSelected).toHaveBeenCalledOnce();
    expect(ctx.onItemSelected).toHaveBeenCalledOnce();
  });

  it('disabled item does not emit selected or notify ctx, and sets aria-disabled/tabindex', async () => {
    const ctx = makeCtx();
    const onSelected = vi.fn();
    await renderTemplate(
      '<mui-context-menu-item disabled (selected)="onSelected()">Locked</mui-context-menu-item>',
      {
        imports: [ContextMenuItem],
        providers: [{ provide: CONTEXT_MENU_CONTEXT, useValue: ctx }],
        componentProperties: { onSelected },
      },
    );
    fireEvent.click(screen.getByRole('menuitem'));
    expect(onSelected).not.toHaveBeenCalled();
    expect(ctx.onItemSelected).not.toHaveBeenCalled();
    expect(screen.getByRole('menuitem')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('menuitem')).toHaveAttribute('tabindex', '-1');
  });

  it('reflects the color input as data-color', async () => {
    await renderTemplate('<mui-context-menu-item color="danger">Delete</mui-context-menu-item>', {
      imports: [ContextMenuItem],
      providers: [{ provide: CONTEXT_MENU_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('menuitem')).toHaveAttribute('data-color', 'danger');
  });

  it('renders a shortcut when the shortcut input is set', async () => {
    await renderTemplate('<mui-context-menu-item shortcut="⌘K">Edit</mui-context-menu-item>', {
      imports: [ContextMenuItem],
      providers: [{ provide: CONTEXT_MENU_CONTEXT, useValue: makeCtx() }],
    });
    expect(document.querySelector('.mui-context-menu-item__shortcut')?.textContent).toContain(
      '⌘K',
    );
  });
});
