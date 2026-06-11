import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Combobox } from './combobox';
import { ComboboxItem } from './combobox-item';

const IMPORTS = [Combobox, ComboboxItem];

const BASE = `
  <mui-combobox [(value)]="val" placeholder="Select framework…">
    <mui-combobox-item value="angular">Angular</mui-combobox-item>
    <mui-combobox-item value="react">React</mui-combobox-item>
    <mui-combobox-item value="vue">Vue</mui-combobox-item>
  </mui-combobox>
`;

describe('Combobox', () => {
  it('shows placeholder when no value selected', async () => {
    await renderTemplate(BASE, { imports: IMPORTS, componentProperties: { val: '' } });
    expect(screen.getByRole('button')).toHaveTextContent('Select framework…');
  });

  it('opens dropdown on trigger click', async () => {
    const user = userEvent.setup();
    await renderTemplate(BASE, { imports: IMPORTS, componentProperties: { val: '' } });
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('renders all items in open dropdown', async () => {
    const user = userEvent.setup();
    await renderTemplate(BASE, { imports: IMPORTS, componentProperties: { val: '' } });
    await user.click(screen.getByRole('button'));
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('selects item on click and closes dropdown', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    await renderTemplate(
      `<mui-combobox [(value)]="val" (valueChange)="onValueChange($event)">
        <mui-combobox-item value="angular">Angular</mui-combobox-item>
        <mui-combobox-item value="react">React</mui-combobox-item>
      </mui-combobox>`,
      { imports: IMPORTS, componentProperties: { val: '', onValueChange } },
    );
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('option', { name: 'Angular' }));
    expect(onValueChange).toHaveBeenCalledWith('angular');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('trigger has aria-expanded=false when closed', async () => {
    await renderTemplate(BASE, { imports: IMPORTS, componentProperties: { val: '' } });
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('trigger has aria-expanded=true when open', async () => {
    const user = userEvent.setup();
    await renderTemplate(BASE, { imports: IMPORTS, componentProperties: { val: '' } });
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('trigger has aria-haspopup=listbox', async () => {
    await renderTemplate(BASE, { imports: IMPORTS, componentProperties: { val: '' } });
    expect(screen.getByRole('button')).toHaveAttribute('aria-haspopup', 'listbox');
  });

  it('filters items by search', async () => {
    const user = userEvent.setup();
    await renderTemplate(BASE, { imports: IMPORTS, componentProperties: { val: '' } });
    await user.click(screen.getByRole('button'));
    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'ang');
    // "angular".includes("ang") → true; react, vue → false
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option', { name: 'Angular' })).toBeInTheDocument();
  });

  it('disabled combobox does not open', async () => {
    await renderTemplate(
      `<mui-combobox [disabled]="true">
        <mui-combobox-item value="a">A</mui-combobox-item>
      </mui-combobox>`,
      { imports: IMPORTS },
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
