import { signal } from '@angular/core';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { HOVER_CARD_CONTEXT } from './hover-card';
import type { HoverCardContext } from './hover-card';
import { HoverCardContent } from './hover-card-content';

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

describe('HoverCardContent', () => {
  it('does not render the panel when ctx.open() is false', async () => {
    await renderTemplate('<mui-hover-card-content>Info</mui-hover-card-content>', {
      imports: [HoverCardContent],
      providers: [{ provide: HOVER_CARD_CONTEXT, useValue: makeCtx({ open: signal(false) }) }],
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('renders the panel with role=tooltip when ctx.open() is true', async () => {
    await renderTemplate('<mui-hover-card-content>Info</mui-hover-card-content>', {
      imports: [HoverCardContent],
      providers: [{ provide: HOVER_CARD_CONTEXT, useValue: makeCtx({ open: signal(true) }) }],
    });
    expect(screen.getByRole('tooltip')).toHaveTextContent('Info');
  });

  it('reflects ctx.placement() as data-placement', async () => {
    await renderTemplate('<mui-hover-card-content>Info</mui-hover-card-content>', {
      imports: [HoverCardContent],
      providers: [
        {
          provide: HOVER_CARD_CONTEXT,
          useValue: makeCtx({ open: signal(true), placement: signal('top') }),
        },
      ],
    });
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-placement', 'top');
  });

  it('cancels the scheduled close when the pointer enters the panel', async () => {
    const user = userEvent.setup();
    const ctx = makeCtx({ open: signal(true) });
    await renderTemplate('<mui-hover-card-content>Info</mui-hover-card-content>', {
      imports: [HoverCardContent],
      providers: [{ provide: HOVER_CARD_CONTEXT, useValue: ctx }],
    });
    await user.hover(screen.getByRole('tooltip'));
    expect(ctx.cancelClose).toHaveBeenCalled();
  });

  it('schedules a close when the pointer leaves the panel', async () => {
    const user = userEvent.setup();
    const ctx = makeCtx({ open: signal(true) });
    await renderTemplate('<mui-hover-card-content>Info</mui-hover-card-content>', {
      imports: [HoverCardContent],
      providers: [{ provide: HOVER_CARD_CONTEXT, useValue: ctx }],
    });
    await user.hover(screen.getByRole('tooltip'));
    await user.unhover(screen.getByRole('tooltip'));
    expect(ctx.scheduleClose).toHaveBeenCalled();
  });
});
