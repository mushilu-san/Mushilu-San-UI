import { signal } from '@angular/core';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { SIDEBAR_CONTEXT } from './sidebar-context';
import type { SidebarContext } from './sidebar-context';
import { SidebarTrigger } from './sidebar-trigger';

function makeCtx(expanded = true): SidebarContext {
  return { expanded: signal(expanded), toggle: vi.fn() };
}

describe('SidebarTrigger', () => {
  it('sets aria-expanded to reflect ctx.expanded()', async () => {
    await renderTemplate('<button muiSidebarTrigger></button>', {
      imports: [SidebarTrigger],
      providers: [{ provide: SIDEBAR_CONTEXT, useValue: makeCtx(true) }],
    });
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('sets aria-label to "Collapse sidebar" when expanded', async () => {
    await renderTemplate('<button muiSidebarTrigger></button>', {
      imports: [SidebarTrigger],
      providers: [{ provide: SIDEBAR_CONTEXT, useValue: makeCtx(true) }],
    });
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Collapse sidebar');
  });

  it('sets aria-label to "Expand sidebar" when collapsed', async () => {
    await renderTemplate('<button muiSidebarTrigger></button>', {
      imports: [SidebarTrigger],
      providers: [{ provide: SIDEBAR_CONTEXT, useValue: makeCtx(false) }],
    });
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Expand sidebar');
    expect(screen.getByRole('button')).not.toHaveAttribute('data-expanded');
  });

  it('calls ctx.toggle() on click', async () => {
    const user = userEvent.setup();
    const ctx = makeCtx();
    await renderTemplate('<button muiSidebarTrigger></button>', {
      imports: [SidebarTrigger],
      providers: [{ provide: SIDEBAR_CONTEXT, useValue: ctx }],
    });
    await user.click(screen.getByRole('button'));
    expect(ctx.toggle).toHaveBeenCalledOnce();
  });

  it('exposes part="trigger"', async () => {
    await renderTemplate('<button muiSidebarTrigger></button>', {
      imports: [SidebarTrigger],
      providers: [{ provide: SIDEBAR_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('button')).toHaveAttribute('part', 'trigger');
  });
});
