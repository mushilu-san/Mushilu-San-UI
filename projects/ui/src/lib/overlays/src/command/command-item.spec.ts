import { signal } from '@angular/core';
import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { COMMAND_CONTEXT } from './command';
import type { CommandContext } from './command';
import { CommandItem } from './command-item';

function makeCtx(search = ''): CommandContext {
  return {
    search: signal(search) as unknown as CommandContext['search'],
    setSearch: vi.fn(),
    onItemActivated: vi.fn(),
    focusNext: vi.fn(),
    focusPrev: vi.fn(),
  };
}

describe('CommandItem', () => {
  it('renders with role=option', async () => {
    await renderTemplate('<mui-command-item value="copy">Copy</mui-command-item>', {
      imports: [CommandItem],
      providers: [{ provide: COMMAND_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('option')).toHaveTextContent('Copy');
  });

  it('emits activated and calls ctx.onItemActivated() on click', async () => {
    const user = userEvent.setup();
    const ctx = makeCtx();
    const onActivated = vi.fn();
    await renderTemplate(
      '<mui-command-item value="copy" (activated)="onActivated($event)">Copy</mui-command-item>',
      {
        imports: [CommandItem],
        providers: [{ provide: COMMAND_CONTEXT, useValue: ctx }],
        componentProperties: { onActivated },
      },
    );
    await user.click(screen.getByRole('option'));
    expect(onActivated).toHaveBeenCalledWith('copy');
    expect(ctx.onItemActivated).toHaveBeenCalledWith('copy', 'copy');
  });

  it('disabled item does not emit activated or notify ctx', async () => {
    const ctx = makeCtx();
    const onActivated = vi.fn();
    await renderTemplate(
      '<mui-command-item value="copy" disabled (activated)="onActivated($event)">Copy</mui-command-item>',
      {
        imports: [CommandItem],
        providers: [{ provide: COMMAND_CONTEXT, useValue: ctx }],
        componentProperties: { onActivated },
      },
    );
    fireEvent.click(screen.getByRole('option'));
    expect(onActivated).not.toHaveBeenCalled();
    expect(ctx.onItemActivated).not.toHaveBeenCalled();
    expect(screen.getByRole('option')).toHaveAttribute('aria-disabled', 'true');
  });

  it('reflects the selected input as aria-selected', async () => {
    await renderTemplate('<mui-command-item value="copy" [selected]="true">Copy</mui-command-item>', {
      imports: [CommandItem],
      providers: [{ provide: COMMAND_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('option')).toHaveAttribute('aria-selected', 'true');
  });

  it('is hidden when the value does not match ctx.search()', async () => {
    await renderTemplate('<mui-command-item value="copy">Copy</mui-command-item>', {
      imports: [CommandItem],
      providers: [{ provide: COMMAND_CONTEXT, useValue: makeCtx('paste') }],
    });
    expect(document.querySelector('mui-command-item')).toHaveStyle({ display: 'none' });
  });

  it('stays visible when the value matches ctx.search()', async () => {
    await renderTemplate('<mui-command-item value="copy">Copy</mui-command-item>', {
      imports: [CommandItem],
      providers: [{ provide: COMMAND_CONTEXT, useValue: makeCtx('cop') }],
    });
    expect(document.querySelector('mui-command-item')).not.toHaveStyle({ display: 'none' });
  });
});
