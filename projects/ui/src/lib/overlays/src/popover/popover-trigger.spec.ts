import { signal } from '@angular/core';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { POPOVER_CONTEXT } from './popover';
import type { PopoverContext } from './popover';
import { PopoverTrigger } from './popover-trigger';

function makeCtx(open = false): PopoverContext {
  return {
    open: signal(open) as unknown as PopoverContext['open'],
    toggle: vi.fn(),
    close: vi.fn(),
  };
}

describe('PopoverTrigger', () => {
  it('sets aria-expanded=false when ctx.open() is false', async () => {
    await renderTemplate('<button muiPopoverTrigger>Open</button>', {
      imports: [PopoverTrigger],
      providers: [{ provide: POPOVER_CONTEXT, useValue: makeCtx(false) }],
    });
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('sets aria-expanded=true when ctx.open() is true', async () => {
    await renderTemplate('<button muiPopoverTrigger>Open</button>', {
      imports: [PopoverTrigger],
      providers: [{ provide: POPOVER_CONTEXT, useValue: makeCtx(true) }],
    });
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('sets aria-haspopup="dialog"', async () => {
    await renderTemplate('<button muiPopoverTrigger>Open</button>', {
      imports: [PopoverTrigger],
      providers: [{ provide: POPOVER_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('button')).toHaveAttribute('aria-haspopup', 'dialog');
  });

  it('exposes part="trigger" on the host element', async () => {
    await renderTemplate('<button muiPopoverTrigger>Open</button>', {
      imports: [PopoverTrigger],
      providers: [{ provide: POPOVER_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('button')).toHaveAttribute('part', 'trigger');
  });

  it('calls ctx.toggle() and stops click propagation to ancestors', async () => {
    const user = userEvent.setup();
    const ctx = makeCtx();
    const onOuterClick = vi.fn();
    await renderTemplate(
      '<div (click)="onOuterClick()"><button muiPopoverTrigger>Open</button></div>',
      {
        imports: [PopoverTrigger],
        providers: [{ provide: POPOVER_CONTEXT, useValue: ctx }],
        componentProperties: { onOuterClick },
      },
    );
    await user.click(screen.getByRole('button'));
    expect(ctx.toggle).toHaveBeenCalledOnce();
    expect(onOuterClick).not.toHaveBeenCalled();
  });
});
