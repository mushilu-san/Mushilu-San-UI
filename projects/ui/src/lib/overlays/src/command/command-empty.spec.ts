import { signal } from '@angular/core';

import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { COMMAND_CONTEXT } from './command';
import type { CommandContext } from './command';
import { CommandEmpty } from './command-empty';

function makeCtx(search = ''): CommandContext {
  return {
    search: signal(search) as unknown as CommandContext['search'],
    setSearch: vi.fn(),
    onItemActivated: vi.fn(),
    focusNext: vi.fn(),
    focusPrev: vi.fn(),
  };
}

describe('CommandEmpty', () => {
  it('announces politely and projects content', async () => {
    await renderTemplate('<mui-command-empty>No results found.</mui-command-empty>', {
      imports: [CommandEmpty],
      providers: [{ provide: COMMAND_CONTEXT, useValue: makeCtx('xyz') }],
    });
    const empty = document.querySelector('.mui-command-empty');
    expect(empty).toHaveAttribute('aria-live', 'polite');
    expect(empty).toHaveTextContent('No results found.');
  });

  it('exposes part="empty"', async () => {
    await renderTemplate('<mui-command-empty>No results found.</mui-command-empty>', {
      imports: [CommandEmpty],
      providers: [{ provide: COMMAND_CONTEXT, useValue: makeCtx() }],
    });
    expect(document.querySelector('.mui-command-empty')).toHaveAttribute('part', 'empty');
  });
});
