import { signal } from '@angular/core';
import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { TOGGLE_GROUP_CONTEXT } from './toggle-group';
import type { ToggleGroupContext } from './toggle-group';
import { ToggleGroupItem } from './toggle-group-item';

function makeCtx(overrides: Partial<ToggleGroupContext> = {}): ToggleGroupContext {
  return {
    type: signal('single'),
    size: signal('md'),
    variant: signal('default'),
    disabled: signal(false),
    isSelected: vi.fn(() => false),
    select: vi.fn(),
    ...overrides,
  };
}

describe('ToggleGroupItem', () => {
  it('reflects ctx.isSelected() via aria-pressed and data-selected', async () => {
    const ctx = makeCtx({ isSelected: vi.fn(() => true) });
    await renderTemplate('<mui-toggle-group-item value="bold">Bold</mui-toggle-group-item>', {
      imports: [ToggleGroupItem],
      providers: [{ provide: TOGGLE_GROUP_CONTEXT, useValue: ctx }],
    });
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button')).toHaveAttribute('data-selected', '');
  });

  it('calls ctx.select(value) with its own value on click', async () => {
    const user = userEvent.setup();
    const ctx = makeCtx();
    await renderTemplate('<mui-toggle-group-item value="italic">Italic</mui-toggle-group-item>', {
      imports: [ToggleGroupItem],
      providers: [{ provide: TOGGLE_GROUP_CONTEXT, useValue: ctx }],
    });
    await user.click(screen.getByRole('button'));
    expect(ctx.select).toHaveBeenCalledWith('italic');
  });

  it('does not select when its own disabled input is true', async () => {
    const ctx = makeCtx();
    await renderTemplate('<mui-toggle-group-item value="x" disabled>X</mui-toggle-group-item>', {
      imports: [ToggleGroupItem],
      providers: [{ provide: TOGGLE_GROUP_CONTEXT, useValue: ctx }],
    });
    fireEvent.click(screen.getByRole('button'));
    expect(ctx.select).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });

  it('does not select when ctx.disabled() is true (group-level disable)', async () => {
    const ctx = makeCtx({ disabled: signal(true) });
    await renderTemplate('<mui-toggle-group-item value="x">X</mui-toggle-group-item>', {
      imports: [ToggleGroupItem],
      providers: [{ provide: TOGGLE_GROUP_CONTEXT, useValue: ctx }],
    });
    fireEvent.click(screen.getByRole('button'));
    expect(ctx.select).not.toHaveBeenCalled();
  });

  it('reflects ctx.size() and ctx.variant() as data attributes', async () => {
    const ctx = makeCtx({ size: signal('lg'), variant: signal('outline') });
    await renderTemplate('<mui-toggle-group-item value="x">X</mui-toggle-group-item>', {
      imports: [ToggleGroupItem],
      providers: [{ provide: TOGGLE_GROUP_CONTEXT, useValue: ctx }],
    });
    expect(screen.getByRole('button')).toHaveAttribute('data-size', 'lg');
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'outline');
  });
});
