import { By } from '@angular/platform-browser';
import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { DropdownItem } from './dropdown-item';
import { DropdownMenu } from './dropdown-menu';
import { DropdownSeparator } from './dropdown-separator';
import { DropdownTrigger } from './dropdown-trigger';

const imports = [DropdownMenu, DropdownTrigger, DropdownItem, DropdownSeparator];

const basic = `
  <mui-dropdown-menu>
    <button muiDropdownTrigger>Open</button>
    <mui-dropdown-item>Edit</mui-dropdown-item>
    <mui-dropdown-item>Duplicate</mui-dropdown-item>
    <mui-dropdown-separator />
    <mui-dropdown-item color="danger">Delete</mui-dropdown-item>
  </mui-dropdown-menu>
`;

describe('DropdownMenu', () => {
  it('panel is hidden by default', async () => {
    await renderTemplate(basic, { imports });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens panel on trigger click', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('renders menu items with menuitem role', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
  });

  it('sets aria-expanded on trigger', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    const btn = screen.getByRole('button', { name: 'Open' });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    await user.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });

  it('sets aria-haspopup="menu" on trigger', async () => {
    await renderTemplate(basic, { imports });
    expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('closes when item is clicked', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('emits itemClick on item click', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    await renderTemplate(
      `<mui-dropdown-menu>
        <button muiDropdownTrigger>Open</button>
        <mui-dropdown-item (itemClick)="handler()">Edit</mui-dropdown-item>
       </mui-dropdown-menu>`,
      { imports, componentProperties: { handler } },
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('disabled item has aria-disabled', async () => {
    const user = userEvent.setup();
    await renderTemplate(
      `<mui-dropdown-menu>
        <button muiDropdownTrigger>Open</button>
        <mui-dropdown-item disabled>Locked</mui-dropdown-item>
       </mui-dropdown-menu>`,
      { imports },
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('menuitem', { name: 'Locked' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('disabled item does not emit itemClick', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    await renderTemplate(
      `<mui-dropdown-menu>
        <button muiDropdownTrigger>Open</button>
        <mui-dropdown-item disabled (itemClick)="handler()">Locked</mui-dropdown-item>
       </mui-dropdown-menu>`,
      { imports, componentProperties: { handler } },
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    // disabled item has pointer-events:none — use fireEvent
    const { fireEvent } = await import('@testing-library/angular');
    fireEvent.click(screen.getByRole('menuitem', { name: 'Locked' }));
    expect(handler).not.toHaveBeenCalled();
  });

  it('renders a separator', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('emits opened event when menu opens', async () => {
    const user = userEvent.setup();
    const onOpened = vi.fn();
    await renderTemplate(
      `<mui-dropdown-menu (opened)="onOpened()">
        <button muiDropdownTrigger>Open</button>
        <mui-dropdown-item>Edit</mui-dropdown-item>
      </mui-dropdown-menu>`,
      { imports, componentProperties: { onOpened } },
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(onOpened).toHaveBeenCalledOnce();
  });

  it('emits closed event when menu closes via second trigger click', async () => {
    const user = userEvent.setup();
    const onClosed = vi.fn();
    await renderTemplate(
      `<mui-dropdown-menu (closed)="onClosed()">
        <button muiDropdownTrigger>Open</button>
        <mui-dropdown-item>Edit</mui-dropdown-item>
      </mui-dropdown-menu>`,
      { imports, componentProperties: { onClosed } },
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(screen.getByRole('button', { name: 'Open' })); // toggle off
    expect(onClosed).toHaveBeenCalledOnce();
  });

  it('clicking outside the panel closes the menu', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.click(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('Escape when menu is closed does not emit closed', async () => {
    const onClosed = vi.fn();
    await renderTemplate(
      `<mui-dropdown-menu (closed)="onClosed()">
        <button muiDropdownTrigger>Open</button>
        <mui-dropdown-item>Edit</mui-dropdown-item>
      </mui-dropdown-menu>`,
      { imports, componentProperties: { onClosed } },
    );
    const host = document.querySelector('mui-dropdown-menu')!;
    fireEvent.keyDown(host, { key: 'Escape' });
    expect(onClosed).not.toHaveBeenCalled();
  });

  it('Tab key closes the menu', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const host = document.querySelector('mui-dropdown-menu')!;
    fireEvent.keyDown(host, { key: 'Tab' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closeOnEscape=false prevents Escape from closing', async () => {
    const user = userEvent.setup();
    await renderTemplate(
      `<mui-dropdown-menu [closeOnEscape]="false">
        <button muiDropdownTrigger>Open</button>
        <mui-dropdown-item>Edit</mui-dropdown-item>
      </mui-dropdown-menu>`,
      { imports },
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const host = document.querySelector('mui-dropdown-menu')!;
    fireEvent.keyDown(host, { key: 'Escape' });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('closeOnSelect=false keeps menu open after item selection', async () => {
    const user = userEvent.setup();
    await renderTemplate(
      `<mui-dropdown-menu [closeOnSelect]="false">
        <button muiDropdownTrigger>Open</button>
        <mui-dropdown-item>Edit</mui-dropdown-item>
      </mui-dropdown-menu>`,
      { imports },
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('ArrowDown focuses first item when nothing is focused', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const host = document.querySelector('mui-dropdown-menu')!;
    fireEvent.keyDown(host, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getAllByRole('menuitem')[0]);
  });

  it('ArrowDown cycles to next item', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const items = screen.getAllByRole('menuitem');
    items[0].focus();
    const host = document.querySelector('mui-dropdown-menu')!;
    fireEvent.keyDown(host, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items[1]);
  });

  it('ArrowDown wraps from last item to first', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const items = screen.getAllByRole('menuitem');
    items[items.length - 1].focus();
    const host = document.querySelector('mui-dropdown-menu')!;
    fireEvent.keyDown(host, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items[0]);
  });

  it('ArrowUp wraps from first item to last', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const items = screen.getAllByRole('menuitem');
    items[0].focus();
    const host = document.querySelector('mui-dropdown-menu')!;
    fireEvent.keyDown(host, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(items[items.length - 1]);
  });

  it('Home key focuses first item', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const items = screen.getAllByRole('menuitem');
    items[1].focus();
    const host = document.querySelector('mui-dropdown-menu')!;
    fireEvent.keyDown(host, { key: 'Home' });
    expect(document.activeElement).toBe(items[0]);
  });

  it('End key focuses last item', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const items = screen.getAllByRole('menuitem');
    items[0].focus();
    const host = document.querySelector('mui-dropdown-menu')!;
    fireEvent.keyDown(host, { key: 'End' });
    expect(document.activeElement).toBe(items[items.length - 1]);
  });

  it('DropdownItem renders icon slot when hasIcon=true', async () => {
    const user = userEvent.setup();
    await renderTemplate(
      `<mui-dropdown-menu>
        <button muiDropdownTrigger>Open</button>
        <mui-dropdown-item [hasIcon]="true">
          <span slot="icon" data-testid="icon">★</span>
          Edit
        </mui-dropdown-item>
      </mui-dropdown-menu>`,
      { imports },
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(document.querySelector('.mui-dropdown-item__icon')).toBeInTheDocument();
  });

  it('DropdownItem renders shortcut when shortcut input is set', async () => {
    const user = userEvent.setup();
    await renderTemplate(
      `<mui-dropdown-menu>
        <button muiDropdownTrigger>Open</button>
        <mui-dropdown-item shortcut="⌘K">Edit</mui-dropdown-item>
      </mui-dropdown-menu>`,
      { imports },
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(document.querySelector('.mui-dropdown-item__shortcut')).toBeInTheDocument();
    expect(document.querySelector('.mui-dropdown-item__shortcut')?.textContent).toContain('⌘K');
  });

  it('DropdownItem buttonEl() returns the inner button element', async () => {
    const user = userEvent.setup();
    const { fixture } = await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const itemDE = fixture.debugElement.query(By.directive(DropdownItem));
    const itemInstance = itemDE.componentInstance as DropdownItem;
    const btn = itemInstance.buttonEl();
    expect(btn).toBeInstanceOf(HTMLButtonElement);
  });

  it('arrow-key navigation skips aria-disabled items', async () => {
    const user = userEvent.setup();
    await renderTemplate(
      `<mui-dropdown-menu>
        <button muiDropdownTrigger>Open</button>
        <mui-dropdown-item>First</mui-dropdown-item>
        <mui-dropdown-item disabled>Disabled</mui-dropdown-item>
        <mui-dropdown-item>Third</mui-dropdown-item>
      </mui-dropdown-menu>`,
      { imports },
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const enabledItems = [
      screen.getByRole('menuitem', { name: 'First' }),
      screen.getByRole('menuitem', { name: 'Third' }),
    ];
    enabledItems[0].focus();
    const host = document.querySelector('mui-dropdown-menu')!;
    fireEvent.keyDown(host, { key: 'ArrowDown' });
    // Should skip Disabled and focus Third directly
    expect(document.activeElement).toBe(enabledItems[1]);
  });
});
