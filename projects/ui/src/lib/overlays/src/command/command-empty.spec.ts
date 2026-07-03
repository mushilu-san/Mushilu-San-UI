import { signal } from '@angular/core';
import { screen } from '@testing-library/angular';
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
  it('renders with role=status and projects content', async () => {
    await renderTemplate('<mui-command-empty>No results found.</mui-command-empty>', {
      imports: [CommandEmpty],
      providers: [{ provide: COMMAND_CONTEXT, useValue: makeCtx('xyz') }],
    });
    expect(screen.getByRole('status')).toHaveTextContent('No results found.');
  });

  it('exposes part="empty"', async () => {
    await renderTemplate('<mui-command-empty>No results found.</mui-command-empty>', {
      imports: [CommandEmpty],
      providers: [{ provide: COMMAND_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('status')).toHaveAttribute('part', 'empty');
  });
});
