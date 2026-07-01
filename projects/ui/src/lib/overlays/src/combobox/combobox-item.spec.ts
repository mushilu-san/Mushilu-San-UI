import { signal } from '@angular/core';
import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { COMBOBOX_CONTEXT } from './combobox';
import type { ComboboxContext } from './combobox';
import { ComboboxItem } from './combobox-item';

function makeCtx(overrides: Partial<ComboboxContext> = {}): ComboboxContext {
  return {
    open: signal(true),
    search: signal(''),
    selectedLabel: signal(''),
    setSearch: vi.fn(),
    selectItem: vi.fn(),
    close: vi.fn(),
    ...overrides,
  };
}

describe('ComboboxItem', () => {
  it('renders with role=option and reflects selection via aria-selected', async () => {
    await renderTemplate('<mui-combobox-item value="angular">Angular</mui-combobox-item>', {
      imports: [ComboboxItem],
      providers: [
        { provide: COMBOBOX_CONTEXT, useValue: makeCtx({ selectedLabel: signal('angular') }) },
      ],
    });
    expect(screen.getByRole('option')).toHaveAttribute('aria-selected', 'true');
  });

  it('is not selected when ctx.selectedLabel() differs from its value', async () => {
    await renderTemplate('<mui-combobox-item value="angular">Angular</mui-combobox-item>', {
      imports: [ComboboxItem],
      providers: [
        { provide: COMBOBOX_CONTEXT, useValue: makeCtx({ selectedLabel: signal('react') }) },
      ],
    });
    expect(screen.getByRole('option')).toHaveAttribute('aria-selected', 'false');
  });

  it('calls ctx.selectItem(value, value) on click', async () => {
    const user = userEvent.setup();
    const ctx = makeCtx();
    await renderTemplate('<mui-combobox-item value="vue">Vue</mui-combobox-item>', {
      imports: [ComboboxItem],
      providers: [{ provide: COMBOBOX_CONTEXT, useValue: ctx }],
    });
    await user.click(screen.getByRole('option'));
    expect(ctx.selectItem).toHaveBeenCalledWith('vue', 'vue');
  });

  it('disabled item does not call ctx.selectItem on click', async () => {
    const ctx = makeCtx();
    await renderTemplate('<mui-combobox-item value="vue" disabled>Vue</mui-combobox-item>', {
      imports: [ComboboxItem],
      providers: [{ provide: COMBOBOX_CONTEXT, useValue: ctx }],
    });
    fireEvent.click(screen.getByRole('option'));
    expect(ctx.selectItem).not.toHaveBeenCalled();
    expect(screen.getByRole('option')).toHaveAttribute('aria-disabled', 'true');
  });

  it('is hidden when ctx.search() does not match its value', async () => {
    await renderTemplate('<mui-combobox-item value="angular">Angular</mui-combobox-item>', {
      imports: [ComboboxItem],
      providers: [{ provide: COMBOBOX_CONTEXT, useValue: makeCtx({ search: signal('rea') }) }],
    });
    const host = document.querySelector('mui-combobox-item') as HTMLElement;
    expect(host.style.display).toBe('none');
  });

  it('stays visible when ctx.search() matches its value (case-insensitive)', async () => {
    await renderTemplate('<mui-combobox-item value="angular">Angular</mui-combobox-item>', {
      imports: [ComboboxItem],
      providers: [{ provide: COMBOBOX_CONTEXT, useValue: makeCtx({ search: signal('ANG') }) }],
    });
    const host = document.querySelector('mui-combobox-item') as HTMLElement;
    expect(host.style.display).not.toBe('none');
  });
});
