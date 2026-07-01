import { signal } from '@angular/core';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { HOVER_CARD_CONTEXT } from './hover-card';
import type { HoverCardContext } from './hover-card';
import { HoverCardTrigger } from './hover-card-trigger';

function makeCtx(overrides: Partial<HoverCardContext> = {}): HoverCardContext {
  return {
    open: signal(false),
    placement: signal('bottom'),
    scheduleOpen: vi.fn(),
    scheduleClose: vi.fn(),
    cancelClose: vi.fn(),
    ...overrides,
  };
}

describe('HoverCardTrigger', () => {
  it('calls ctx.scheduleOpen() on hover', async () => {
    const user = userEvent.setup();
    const ctx = makeCtx();
    await renderTemplate('<a muiHoverCardTrigger href="#">Hover</a>', {
      imports: [HoverCardTrigger],
      providers: [{ provide: HOVER_CARD_CONTEXT, useValue: ctx }],
    });
    await user.hover(screen.getByRole('link'));
    expect(ctx.scheduleOpen).toHaveBeenCalledOnce();
  });

  it('calls ctx.scheduleClose() on unhover', async () => {
    const user = userEvent.setup();
    const ctx = makeCtx();
    await renderTemplate('<a muiHoverCardTrigger href="#">Hover</a>', {
      imports: [HoverCardTrigger],
      providers: [{ provide: HOVER_CARD_CONTEXT, useValue: ctx }],
    });
    await user.hover(screen.getByRole('link'));
    await user.unhover(screen.getByRole('link'));
    expect(ctx.scheduleClose).toHaveBeenCalledOnce();
  });

  it('calls ctx.scheduleOpen() on focus', async () => {
    const ctx = makeCtx();
    await renderTemplate('<a muiHoverCardTrigger href="#">Hover</a>', {
      imports: [HoverCardTrigger],
      providers: [{ provide: HOVER_CARD_CONTEXT, useValue: ctx }],
    });
    screen.getByRole('link').focus();
    expect(ctx.scheduleOpen).toHaveBeenCalledOnce();
  });

  it('calls ctx.scheduleClose() on blur', async () => {
    const ctx = makeCtx();
    await renderTemplate('<a muiHoverCardTrigger href="#">Hover</a>', {
      imports: [HoverCardTrigger],
      providers: [{ provide: HOVER_CARD_CONTEXT, useValue: ctx }],
    });
    screen.getByRole('link').focus();
    screen.getByRole('link').blur();
    expect(ctx.scheduleClose).toHaveBeenCalledOnce();
  });

  it('exposes part="trigger" on the host element', async () => {
    await renderTemplate('<a muiHoverCardTrigger href="#">Hover</a>', {
      imports: [HoverCardTrigger],
      providers: [{ provide: HOVER_CARD_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('link')).toHaveAttribute('part', 'trigger');
  });
});
