import { signal } from '@angular/core';
import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { MENUBAR_MENU_CONTEXT } from './menubar-context';
import type { MenubarMenuContext } from './menubar-context';
import { MenubarTrigger } from './menubar-trigger';

function makeCtx(isOpen = false): MenubarMenuContext {
  return { id: 'menu-1', isOpen: signal(isOpen), toggle: vi.fn() };
}

describe('MenubarTrigger (isolated)', () => {
  it('renders with role=menuitem', async () => {
    await renderTemplate('<button muiMenubarTrigger>File</button>', {
      imports: [MenubarTrigger],
      providers: [{ provide: MENUBAR_MENU_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('menuitem')).toHaveTextContent('File');
  });

  it('sets aria-haspopup="menu"', async () => {
    await renderTemplate('<button muiMenubarTrigger>File</button>', {
      imports: [MenubarTrigger],
      providers: [{ provide: MENUBAR_MENU_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('menuitem')).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('sets aria-expanded to reflect ctx.isOpen()', async () => {
    await renderTemplate('<button muiMenubarTrigger>File</button>', {
      imports: [MenubarTrigger],
      providers: [{ provide: MENUBAR_MENU_CONTEXT, useValue: makeCtx(true) }],
    });
    expect(screen.getByRole('menuitem')).toHaveAttribute('aria-expanded', 'true');
  });

  it('calls ctx.toggle() on click', async () => {
    const user = userEvent.setup();
    const ctx = makeCtx();
    await renderTemplate('<button muiMenubarTrigger>File</button>', {
      imports: [MenubarTrigger],
      providers: [{ provide: MENUBAR_MENU_CONTEXT, useValue: ctx }],
    });
    await user.click(screen.getByRole('menuitem'));
    expect(ctx.toggle).toHaveBeenCalledOnce();
  });

  it('ArrowDown opens the menu when closed', async () => {
    const ctx = makeCtx(false);
    await renderTemplate('<button muiMenubarTrigger>File</button>', {
      imports: [MenubarTrigger],
      providers: [{ provide: MENUBAR_MENU_CONTEXT, useValue: ctx }],
    });
    fireEvent.keyDown(screen.getByRole('menuitem'), { key: 'ArrowDown' });
    expect(ctx.toggle).toHaveBeenCalledOnce();
  });

  it('ArrowDown does not re-toggle when already open', async () => {
    const ctx = makeCtx(true);
    await renderTemplate('<button muiMenubarTrigger>File</button>', {
      imports: [MenubarTrigger],
      providers: [{ provide: MENUBAR_MENU_CONTEXT, useValue: ctx }],
    });
    fireEvent.keyDown(screen.getByRole('menuitem'), { key: 'ArrowDown' });
    expect(ctx.toggle).not.toHaveBeenCalled();
  });

  it('exposes part="trigger"', async () => {
    await renderTemplate('<button muiMenubarTrigger>File</button>', {
      imports: [MenubarTrigger],
      providers: [{ provide: MENUBAR_MENU_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('menuitem')).toHaveAttribute('part', 'trigger');
  });
});
