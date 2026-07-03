import { signal } from '@angular/core';
import { fireEvent, screen } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { MENUBAR_MENU_CONTEXT } from './menubar-context';
import type { MenubarMenuContext } from './menubar-context';
import { MenubarContent } from './menubar-content';

function makeCtx(isOpen = false): MenubarMenuContext {
  return { id: 'menu-1', isOpen: signal(isOpen), toggle: vi.fn() };
}

describe('MenubarContent (isolated)', () => {
  it('renders with role=menu', async () => {
    await renderTemplate('<mui-menubar-content></mui-menubar-content>', {
      imports: [MenubarContent],
      providers: [{ provide: MENUBAR_MENU_CONTEXT, useValue: makeCtx(true) }],
    });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('sets data-open when ctx.isOpen() is true', async () => {
    await renderTemplate('<mui-menubar-content></mui-menubar-content>', {
      imports: [MenubarContent],
      providers: [{ provide: MENUBAR_MENU_CONTEXT, useValue: makeCtx(true) }],
    });
    expect(screen.getByRole('menu')).toHaveAttribute('data-open');
  });

  it('omits data-open when ctx.isOpen() is false', async () => {
    await renderTemplate('<mui-menubar-content></mui-menubar-content>', {
      imports: [MenubarContent],
      providers: [{ provide: MENUBAR_MENU_CONTEXT, useValue: makeCtx(false) }],
    });
    expect(screen.getByRole('menu', { hidden: true })).not.toHaveAttribute('data-open');
  });

  it('ArrowDown moves focus among projected menu items and stops propagation', async () => {
    const onOuterKeydown = vi.fn();
    await renderTemplate(
      `<div (keydown)="onOuterKeydown()">
        <mui-menubar-content>
          <div muiMenubarItem tabindex="0" id="i1">New</div>
          <div muiMenubarItem tabindex="-1" id="i2">Open</div>
        </mui-menubar-content>
      </div>`,
      {
        imports: [MenubarContent],
        providers: [{ provide: MENUBAR_MENU_CONTEXT, useValue: makeCtx(true) }],
        componentProperties: { onOuterKeydown },
      },
    );
    const item1 = document.getElementById('i1') as HTMLElement;
    const item2 = document.getElementById('i2') as HTMLElement;
    item1.focus();
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(item2);
    expect(onOuterKeydown).not.toHaveBeenCalled();
  });

  it('skips items with aria-disabled="true"', async () => {
    await renderTemplate(
      `<mui-menubar-content>
        <div muiMenubarItem tabindex="0" id="i1">New</div>
        <div muiMenubarItem aria-disabled="true" tabindex="-1" id="i2">Open</div>
        <div muiMenubarItem tabindex="-1" id="i3">Save</div>
      </mui-menubar-content>`,
      {
        imports: [MenubarContent],
        providers: [{ provide: MENUBAR_MENU_CONTEXT, useValue: makeCtx(true) }],
      },
    );
    const item1 = document.getElementById('i1') as HTMLElement;
    const item3 = document.getElementById('i3') as HTMLElement;
    item1.focus();
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(item3);
  });

  it('exposes part="content"', async () => {
    await renderTemplate('<mui-menubar-content></mui-menubar-content>', {
      imports: [MenubarContent],
      providers: [{ provide: MENUBAR_MENU_CONTEXT, useValue: makeCtx(true) }],
    });
    expect(screen.getByRole('menu')).toHaveAttribute('part', 'content');
  });
});
