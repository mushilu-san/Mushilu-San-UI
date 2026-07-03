import { signal } from '@angular/core';
import { screen } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { NAV_MENU_ITEM_CONTEXT } from './navigation-menu-context';
import type { NavMenuItemContext } from './navigation-menu-context';
import { NavigationMenuContent } from './navigation-menu-content';

function makeCtx(isOpen = false): NavMenuItemContext {
  return { id: 'nav-item-1', isOpen: signal(isOpen), toggle: vi.fn() };
}

describe('NavigationMenuContent (isolated)', () => {
  it('projects content', async () => {
    await renderTemplate('<mui-navigation-menu-content>Links</mui-navigation-menu-content>', {
      imports: [NavigationMenuContent],
      providers: [{ provide: NAV_MENU_ITEM_CONTEXT, useValue: makeCtx(true) }],
    });
    expect(screen.getByText('Links')).toBeInTheDocument();
  });

  it('sets data-open and no hidden attribute when ctx.isOpen() is true', async () => {
    await renderTemplate('<mui-navigation-menu-content>Links</mui-navigation-menu-content>', {
      imports: [NavigationMenuContent],
      providers: [{ provide: NAV_MENU_ITEM_CONTEXT, useValue: makeCtx(true) }],
    });
    const el = document.querySelector('mui-navigation-menu-content');
    expect(el).toHaveAttribute('data-open');
    expect(el).not.toHaveAttribute('hidden');
  });

  it('is hidden and has no data-open when ctx.isOpen() is false', async () => {
    await renderTemplate('<mui-navigation-menu-content>Links</mui-navigation-menu-content>', {
      imports: [NavigationMenuContent],
      providers: [{ provide: NAV_MENU_ITEM_CONTEXT, useValue: makeCtx(false) }],
    });
    const el = document.querySelector('mui-navigation-menu-content');
    expect(el).not.toHaveAttribute('data-open');
    expect(el).toHaveAttribute('hidden');
  });

  it('exposes part="content"', async () => {
    await renderTemplate('<mui-navigation-menu-content>Links</mui-navigation-menu-content>', {
      imports: [NavigationMenuContent],
      providers: [{ provide: NAV_MENU_ITEM_CONTEXT, useValue: makeCtx() }],
    });
    expect(document.querySelector('mui-navigation-menu-content')).toHaveAttribute(
      'part',
      'content',
    );
  });
});
