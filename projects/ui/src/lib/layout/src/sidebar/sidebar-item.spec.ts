import { signal } from '@angular/core';
import { screen } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { SIDEBAR_CONTEXT } from './sidebar-context';
import type { SidebarContext } from './sidebar-context';
import { SidebarItem } from './sidebar-item';

function makeCtx(expanded = true): SidebarContext {
  return { expanded: signal(expanded), toggle: vi.fn() };
}

describe('SidebarItem', () => {
  it('renders on an anchor with role=link', async () => {
    await renderTemplate('<a muiSidebarItem href="#" label="Home">Home</a>', {
      imports: [SidebarItem],
      providers: [{ provide: SIDEBAR_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('sets aria-current="page" and data-active when active', async () => {
    await renderTemplate('<button muiSidebarItem active>Home</button>', {
      imports: [SidebarItem],
      providers: [{ provide: SIDEBAR_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button')).toHaveAttribute('data-active');
  });

  it('omits aria-current and data-active when not active', async () => {
    await renderTemplate('<button muiSidebarItem>Home</button>', {
      imports: [SidebarItem],
      providers: [{ provide: SIDEBAR_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('button')).not.toHaveAttribute('data-active');
  });

  it('reflects ctx.expanded() as data-expanded', async () => {
    await renderTemplate('<button muiSidebarItem>Home</button>', {
      imports: [SidebarItem],
      providers: [{ provide: SIDEBAR_CONTEXT, useValue: makeCtx(true) }],
    });
    expect(screen.getByRole('button')).toHaveAttribute('data-expanded');
  });

  it('sets a title tooltip with the label when collapsed', async () => {
    await renderTemplate('<button muiSidebarItem label="Home">🏠</button>', {
      imports: [SidebarItem],
      providers: [{ provide: SIDEBAR_CONTEXT, useValue: makeCtx(false) }],
    });
    expect(screen.getByRole('button')).toHaveAttribute('title', 'Home');
  });

  it('omits the title tooltip when expanded', async () => {
    await renderTemplate('<button muiSidebarItem label="Home">🏠</button>', {
      imports: [SidebarItem],
      providers: [{ provide: SIDEBAR_CONTEXT, useValue: makeCtx(true) }],
    });
    expect(screen.getByRole('button')).not.toHaveAttribute('title');
  });
});
