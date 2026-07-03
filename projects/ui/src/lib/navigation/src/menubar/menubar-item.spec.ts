import { signal } from '@angular/core';
import { fireEvent, screen } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { MENUBAR_CONTEXT } from './menubar-context';
import type { MenubarContext } from './menubar-context';
import { MenubarItem } from './menubar-item';

function makeCtx(): MenubarContext {
  return { openId: signal<string | null>('menu-1'), setOpen: vi.fn() };
}

describe('MenubarItem (isolated)', () => {
  it('renders with role=menuitem', async () => {
    await renderTemplate('<div muiMenubarItem>New</div>', {
      imports: [MenubarItem],
      providers: [{ provide: MENUBAR_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('menuitem')).toHaveTextContent('New');
  });

  it('clicking closes the menubar via root.setOpen(null)', async () => {
    const ctx = makeCtx();
    await renderTemplate('<div muiMenubarItem>New</div>', {
      imports: [MenubarItem],
      providers: [{ provide: MENUBAR_CONTEXT, useValue: ctx }],
    });
    fireEvent.click(screen.getByRole('menuitem'));
    expect(ctx.setOpen).toHaveBeenCalledWith(null);
  });

  it('Enter key closes the menubar', async () => {
    const ctx = makeCtx();
    await renderTemplate('<div muiMenubarItem>New</div>', {
      imports: [MenubarItem],
      providers: [{ provide: MENUBAR_CONTEXT, useValue: ctx }],
    });
    fireEvent.keyDown(screen.getByRole('menuitem'), { key: 'Enter' });
    expect(ctx.setOpen).toHaveBeenCalledWith(null);
  });

  it('Space key closes the menubar', async () => {
    const ctx = makeCtx();
    await renderTemplate('<div muiMenubarItem>New</div>', {
      imports: [MenubarItem],
      providers: [{ provide: MENUBAR_CONTEXT, useValue: ctx }],
    });
    fireEvent.keyDown(screen.getByRole('menuitem'), { key: ' ' });
    expect(ctx.setOpen).toHaveBeenCalledWith(null);
  });

  it('disabled item does not close the menubar on click', async () => {
    const ctx = makeCtx();
    await renderTemplate('<div muiMenubarItem disabled>Save</div>', {
      imports: [MenubarItem],
      providers: [{ provide: MENUBAR_CONTEXT, useValue: ctx }],
    });
    fireEvent.click(screen.getByRole('menuitem'));
    expect(ctx.setOpen).not.toHaveBeenCalled();
    expect(screen.getByRole('menuitem')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('menuitem')).toHaveAttribute('tabindex', '-1');
  });

  it('enabled item has tabindex=0', async () => {
    await renderTemplate('<div muiMenubarItem>New</div>', {
      imports: [MenubarItem],
      providers: [{ provide: MENUBAR_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('menuitem')).toHaveAttribute('tabindex', '0');
  });

  it('exposes part="item"', async () => {
    await renderTemplate('<div muiMenubarItem>New</div>', {
      imports: [MenubarItem],
      providers: [{ provide: MENUBAR_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('menuitem')).toHaveAttribute('part', 'item');
  });
});
