import { signal } from '@angular/core';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { COMMAND_CONTEXT } from './command';
import type { CommandContext } from './command';
import { CommandInput } from './command-input';

function makeCtx(search = ''): CommandContext {
  return {
    search: signal(search) as unknown as CommandContext['search'],
    setSearch: vi.fn(),
    onItemActivated: vi.fn(),
    focusNext: vi.fn(),
    focusPrev: vi.fn(),
  };
}

describe('CommandInput', () => {
  it('binds the input value to ctx.search()', async () => {
    await renderTemplate('<mui-command-input />', {
      imports: [CommandInput],
      providers: [{ provide: COMMAND_CONTEXT, useValue: makeCtx('foo') }],
    });
    expect(screen.getByRole('textbox')).toHaveValue('foo');
  });

  it('calls ctx.setSearch() on input', async () => {
    const ctx = makeCtx();
    await renderTemplate('<mui-command-input />', {
      imports: [CommandInput],
      providers: [{ provide: COMMAND_CONTEXT, useValue: ctx }],
    });
    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox'), 'a');
    expect(ctx.setSearch).toHaveBeenCalled();
  });

  it('ArrowDown calls ctx.focusNext()', async () => {
    const ctx = makeCtx();
    await renderTemplate('<mui-command-input />', {
      imports: [CommandInput],
      providers: [{ provide: COMMAND_CONTEXT, useValue: ctx }],
    });
    const user = userEvent.setup();
    screen.getByRole('textbox').focus();
    await user.keyboard('{ArrowDown}');
    expect(ctx.focusNext).toHaveBeenCalledOnce();
  });

  it('ArrowUp calls ctx.focusPrev()', async () => {
    const ctx = makeCtx();
    await renderTemplate('<mui-command-input />', {
      imports: [CommandInput],
      providers: [{ provide: COMMAND_CONTEXT, useValue: ctx }],
    });
    const user = userEvent.setup();
    screen.getByRole('textbox').focus();
    await user.keyboard('{ArrowUp}');
    expect(ctx.focusPrev).toHaveBeenCalledOnce();
  });

  it('renders the placeholder input', async () => {
    await renderTemplate('<mui-command-input placeholder="Type a command…" />', {
      imports: [CommandInput],
      providers: [{ provide: COMMAND_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'Type a command…');
  });
});
