import { signal } from '@angular/core';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { DROPDOWN_MENU_CONTEXT } from './dropdown-menu';
import type { DropdownMenu } from './dropdown-menu';
import { DropdownTrigger } from './dropdown-trigger';

function makeCtx(open = false): DropdownMenu {
  return { open: signal(open), toggle: vi.fn() } as unknown as DropdownMenu;
}

describe('DropdownTrigger', () => {
  it('sets aria-expanded=false when ctx.open() is false', async () => {
    await renderTemplate('<button muiDropdownTrigger>Open</button>', {
      imports: [DropdownTrigger],
      providers: [{ provide: DROPDOWN_MENU_CONTEXT, useValue: makeCtx(false) }],
    });
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('sets aria-expanded=true when ctx.open() is true', async () => {
    await renderTemplate('<button muiDropdownTrigger>Open</button>', {
      imports: [DropdownTrigger],
      providers: [{ provide: DROPDOWN_MENU_CONTEXT, useValue: makeCtx(true) }],
    });
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('sets aria-haspopup="menu"', async () => {
    await renderTemplate('<button muiDropdownTrigger>Open</button>', {
      imports: [DropdownTrigger],
      providers: [{ provide: DROPDOWN_MENU_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('button')).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('exposes part="trigger" on the host element', async () => {
    await renderTemplate('<button muiDropdownTrigger>Open</button>', {
      imports: [DropdownTrigger],
      providers: [{ provide: DROPDOWN_MENU_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('button')).toHaveAttribute('part', 'trigger');
  });

  it('calls ctx.toggle() and stops click propagation to ancestors', async () => {
    const user = userEvent.setup();
    const ctx = makeCtx();
    const onOuterClick = vi.fn();
    await renderTemplate(
      '<div (click)="onOuterClick()"><button muiDropdownTrigger>Open</button></div>',
      {
        imports: [DropdownTrigger],
        providers: [{ provide: DROPDOWN_MENU_CONTEXT, useValue: ctx }],
        componentProperties: { onOuterClick },
      },
    );
    await user.click(screen.getByRole('button'));
    expect(ctx.toggle).toHaveBeenCalledOnce();
    expect(onOuterClick).not.toHaveBeenCalled();
  });
});
