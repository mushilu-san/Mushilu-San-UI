import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderComponent, renderTemplate } from '../../../../core/testing';
import { Table } from './table';
import type { TableColumn } from './table.types';

const COLUMNS: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
];

const ROWS = [
  { name: 'Alice', age: 30, role: 'Admin' },
  { name: 'Bob', age: 25, role: 'User' },
];

describe('Table', () => {
  it('renders column headers', async () => {
    await renderComponent(Table, { inputs: { columns: COLUMNS, rows: ROWS } });
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    // sortable headers render a button — query parent th
    expect(document.querySelector('th[scope="col"]:nth-of-type(2)')).toBeInTheDocument();
  });

  it('renders all row cells', async () => {
    await renderComponent(Table, { inputs: { columns: COLUMNS, rows: ROWS } });
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('renders caption when provided', async () => {
    await renderComponent(Table, {
      inputs: { columns: COLUMNS, rows: ROWS, caption: 'Team members' },
    });
    expect(screen.getByText('Team members')).toBeInTheDocument();
  });

  it('uses aria-labelledby=captionId when caption is set', async () => {
    await renderTemplate('<mui-table [columns]="cols" [rows]="rows" caption="Users"></mui-table>', {
      imports: [Table],
      componentProperties: { cols: COLUMNS, rows: ROWS },
    });
    const host = document.querySelector('mui-table')!;
    const caption = document.querySelector('caption')!;
    expect(host.getAttribute('aria-labelledby')).toBe(caption.id);
    expect(host).not.toHaveAttribute('aria-label');
  });

  it('uses aria-label="Data table" when no caption', async () => {
    await renderTemplate('<mui-table [columns]="cols" [rows]="rows"></mui-table>', {
      imports: [Table],
      componentProperties: { cols: COLUMNS, rows: ROWS },
    });
    expect(document.querySelector('mui-table')).toHaveAttribute('aria-label', 'Data table');
  });

  it('sortable columns have sort buttons', async () => {
    await renderComponent(Table, { inputs: { columns: COLUMNS, rows: ROWS } });
    expect(screen.getAllByRole('button')).toHaveLength(2); // Age + Role
  });

  it('non-sortable column has no button', async () => {
    await renderComponent(Table, { inputs: { columns: COLUMNS, rows: ROWS } });
    const nameTh = document.querySelector('th[scope="col"]:nth-of-type(1)')!;
    expect(nameTh.querySelector('button')).toBeNull();
  });

  it('first click sets aria-sort=ascending', async () => {
    await renderComponent(Table, { inputs: { columns: COLUMNS, rows: ROWS } });
    const ageBtn = screen.getByRole('button', { name: /Age/ });
    await userEvent.click(ageBtn);
    expect(ageBtn.closest('th')).toHaveAttribute('aria-sort', 'ascending');
  });

  it('sort button cycles asc → desc → none', async () => {
    const handler = vi.fn();
    await renderTemplate(
      '<mui-table [columns]="cols" [rows]="rows" (sortChange)="h($event)"></mui-table>',
      { imports: [Table], componentProperties: { cols: COLUMNS, rows: ROWS, h: handler } },
    );
    const btn = screen.getByRole('button', { name: /Age/ });

    await userEvent.click(btn);
    expect(handler).toHaveBeenCalledWith({ key: 'age', direction: 'asc' });
    expect(btn.closest('th')).toHaveAttribute('aria-sort', 'ascending');

    await userEvent.click(btn);
    expect(handler).toHaveBeenCalledWith({ key: 'age', direction: 'desc' });
    expect(btn.closest('th')).toHaveAttribute('aria-sort', 'descending');

    await userEvent.click(btn);
    expect(handler).toHaveBeenCalledWith({ key: 'age', direction: null });
    expect(btn.closest('th')).not.toHaveAttribute('aria-sort');
  });

  it('switching sort column resets direction to asc', async () => {
    const handler = vi.fn();
    await renderTemplate(
      '<mui-table [columns]="cols" [rows]="rows" (sortChange)="h($event)"></mui-table>',
      { imports: [Table], componentProperties: { cols: COLUMNS, rows: ROWS, h: handler } },
    );
    await userEvent.click(screen.getByRole('button', { name: /Age/ }));
    await userEvent.click(screen.getByRole('button', { name: /Role/ }));
    expect(handler).toHaveBeenLastCalledWith({ key: 'role', direction: 'asc' });
    expect(screen.getByRole('button', { name: /Age/ }).closest('th')).not.toHaveAttribute(
      'aria-sort',
    );
  });

  it('host has role=region and tabindex=0', async () => {
    await renderTemplate('<mui-table [columns]="cols" [rows]="rows"></mui-table>', {
      imports: [Table],
      componentProperties: { cols: COLUMNS, rows: ROWS },
    });
    const host = document.querySelector('mui-table')!;
    expect(host).toHaveAttribute('role', 'region');
    expect(host).toHaveAttribute('tabindex', '0');
  });
});
