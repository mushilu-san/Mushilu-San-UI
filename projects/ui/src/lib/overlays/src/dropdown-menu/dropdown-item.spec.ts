import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { DROPDOWN_MENU_CONTEXT } from './dropdown-menu';
import type { DropdownMenu } from './dropdown-menu';
import { DropdownItem } from './dropdown-item';

function makeCtx(): DropdownMenu {
  return { onItemSelected: vi.fn() } as unknown as DropdownMenu;
}

describe('DropdownItem', () => {
  it('renders with role=menuitem', async () => {
    await renderTemplate('<mui-dropdown-item>Edit</mui-dropdown-item>', {
      imports: [DropdownItem],
      providers: [{ provide: DROPDOWN_MENU_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('menuitem')).toHaveTextContent('Edit');
  });

  it('calls ctx.onItemSelected() and emits itemClick on click', async () => {
    const user = userEvent.setup();
    const ctx = makeCtx();
    const onClick = vi.fn();
    await renderTemplate('<mui-dropdown-item (itemClick)="onClick()">Edit</mui-dropdown-item>', {
      imports: [DropdownItem],
      providers: [{ provide: DROPDOWN_MENU_CONTEXT, useValue: ctx }],
      componentProperties: { onClick },
    });
    await user.click(screen.getByRole('menuitem'));
    expect(onClick).toHaveBeenCalledOnce();
    expect(ctx.onItemSelected).toHaveBeenCalledOnce();
  });

  it('disabled item does not emit itemClick or notify ctx', async () => {
    const ctx = makeCtx();
    const onClick = vi.fn();
    await renderTemplate(
      '<mui-dropdown-item disabled (itemClick)="onClick()">Locked</mui-dropdown-item>',
      {
        imports: [DropdownItem],
        providers: [{ provide: DROPDOWN_MENU_CONTEXT, useValue: ctx }],
        componentProperties: { onClick },
      },
    );
    fireEvent.click(screen.getByRole('menuitem'));
    expect(onClick).not.toHaveBeenCalled();
    expect(ctx.onItemSelected).not.toHaveBeenCalled();
    expect(screen.getByRole('menuitem')).toHaveAttribute('aria-disabled', 'true');
  });

  it('reflects the color input as data-color', async () => {
    await renderTemplate('<mui-dropdown-item color="danger">Delete</mui-dropdown-item>', {
      imports: [DropdownItem],
      providers: [{ provide: DROPDOWN_MENU_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('menuitem')).toHaveAttribute('data-color', 'danger');
  });

  it('renders the icon slot when hasIcon=true', async () => {
    await renderTemplate(
      `<mui-dropdown-item [hasIcon]="true">
        <span slot="icon" data-testid="icon">★</span>
        Edit
      </mui-dropdown-item>`,
      {
        imports: [DropdownItem],
        providers: [{ provide: DROPDOWN_MENU_CONTEXT, useValue: makeCtx() }],
      },
    );
    expect(document.querySelector('.mui-dropdown-item__icon')).toBeInTheDocument();
  });

  it('renders a shortcut when the shortcut input is set', async () => {
    await renderTemplate('<mui-dropdown-item shortcut="⌘K">Edit</mui-dropdown-item>', {
      imports: [DropdownItem],
      providers: [{ provide: DROPDOWN_MENU_CONTEXT, useValue: makeCtx() }],
    });
    expect(document.querySelector('.mui-dropdown-item__shortcut')?.textContent).toContain('⌘K');
  });
});
