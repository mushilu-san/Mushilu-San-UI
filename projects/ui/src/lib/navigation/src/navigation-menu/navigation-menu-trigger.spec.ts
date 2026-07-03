import { signal } from '@angular/core';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { NAV_MENU_ITEM_CONTEXT } from './navigation-menu-context';
import type { NavMenuItemContext } from './navigation-menu-context';
import { NavigationMenuTrigger } from './navigation-menu-trigger';

function makeCtx(isOpen = false): NavMenuItemContext {
  return { id: 'nav-item-1', isOpen: signal(isOpen), toggle: vi.fn() };
}

describe('NavigationMenuTrigger (isolated)', () => {
  it('sets aria-expanded to reflect ctx.isOpen()', async () => {
    await renderTemplate('<button muiNavMenuTrigger>Products</button>', {
      imports: [NavigationMenuTrigger],
      providers: [{ provide: NAV_MENU_ITEM_CONTEXT, useValue: makeCtx(true) }],
    });
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('sets aria-haspopup="true"', async () => {
    await renderTemplate('<button muiNavMenuTrigger>Products</button>', {
      imports: [NavigationMenuTrigger],
      providers: [{ provide: NAV_MENU_ITEM_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('button')).toHaveAttribute('aria-haspopup', 'true');
  });

  it('sets data-open when ctx.isOpen() is true', async () => {
    await renderTemplate('<button muiNavMenuTrigger>Products</button>', {
      imports: [NavigationMenuTrigger],
      providers: [{ provide: NAV_MENU_ITEM_CONTEXT, useValue: makeCtx(true) }],
    });
    expect(screen.getByRole('button')).toHaveAttribute('data-open');
  });

  it('calls ctx.toggle() on click', async () => {
    const user = userEvent.setup();
    const ctx = makeCtx();
    await renderTemplate('<button muiNavMenuTrigger>Products</button>', {
      imports: [NavigationMenuTrigger],
      providers: [{ provide: NAV_MENU_ITEM_CONTEXT, useValue: ctx }],
    });
    await user.click(screen.getByRole('button'));
    expect(ctx.toggle).toHaveBeenCalledOnce();
  });

  it('exposes part="trigger"', async () => {
    await renderTemplate('<button muiNavMenuTrigger>Products</button>', {
      imports: [NavigationMenuTrigger],
      providers: [{ provide: NAV_MENU_ITEM_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('button')).toHaveAttribute('part', 'trigger');
  });
});
