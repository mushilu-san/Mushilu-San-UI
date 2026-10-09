import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { DropdownItem } from './dropdown-item';
import { DropdownMenu } from './dropdown-menu';
import { DropdownTrigger } from './dropdown-trigger';

describe('DropdownMenu RTL', () => {
  it('H-B-61716a: vertical ArrowDown navigation is unchanged in dir=rtl', async () => {
    const user = userEvent.setup();
    await renderTemplate(
      `<div dir="rtl"><mui-dropdown-menu>
        <button muiDropdownTrigger>Open</button>
        <mui-dropdown-item>Edit</mui-dropdown-item>
        <mui-dropdown-item>Copy</mui-dropdown-item>
      </mui-dropdown-menu></div>`,
      { imports: [DropdownMenu, DropdownTrigger, DropdownItem] },
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const items = screen.getAllByRole('menuitem');
    items[0].focus();
    fireEvent.keyDown(document.querySelector('mui-dropdown-menu') as Element, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items[1]);
  });
});
