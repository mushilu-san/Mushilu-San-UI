import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderComponent, renderTemplate } from '../../../../core/testing';
import { Pagination } from './pagination';

describe('Pagination', () => {
  it('renders navigation landmark', async () => {
    await renderComponent(Pagination, { inputs: { totalPages: 5 } });
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });

  it('renders page buttons', async () => {
    await renderComponent(Pagination, { inputs: { totalPages: 5 } });
    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 5' })).toBeInTheDocument();
  });

  it('sets aria-current="page" on active page', async () => {
    await renderComponent(Pagination, { inputs: { totalPages: 5, page: 3 } });
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
  });

  it('does not set aria-current on other pages', async () => {
    await renderComponent(Pagination, { inputs: { totalPages: 5, page: 3 } });
    expect(screen.getByRole('button', { name: 'Page 1' })).not.toHaveAttribute('aria-current');
  });

  it('disables prev button on first page', async () => {
    await renderComponent(Pagination, { inputs: { totalPages: 5, page: 1 } });
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('disables next button on last page', async () => {
    await renderComponent(Pagination, { inputs: { totalPages: 5, page: 5 } });
    expect(screen.getByRole('button', { name: 'Go to next page' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('enables prev/next buttons on middle page', async () => {
    await renderComponent(Pagination, { inputs: { totalPages: 5, page: 3 } });
    expect(screen.getByRole('button', { name: 'Go to previous page' })).not.toHaveAttribute('aria-disabled');
    expect(screen.getByRole('button', { name: 'Go to next page' })).not.toHaveAttribute('aria-disabled');
  });

  it('emits pageChange when page button clicked', async () => {
    const handler = vi.fn();
    await renderTemplate(
      '<mui-pagination [totalPages]="5" [page]="1" (pageChange)="handler($event)"></mui-pagination>',
      { imports: [Pagination], componentProperties: { handler } },
    );
    await userEvent.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(handler).toHaveBeenCalledWith(3);
  });

  it('emits pageChange when next clicked', async () => {
    const handler = vi.fn();
    await renderTemplate(
      '<mui-pagination [totalPages]="5" [page]="2" (pageChange)="handler($event)"></mui-pagination>',
      { imports: [Pagination], componentProperties: { handler } },
    );
    await userEvent.click(screen.getByRole('button', { name: 'Go to next page' }));
    expect(handler).toHaveBeenCalledWith(3);
  });

  it('does not emit when clicking active page', async () => {
    const handler = vi.fn();
    await renderTemplate(
      '<mui-pagination [totalPages]="5" [page]="2" (pageChange)="handler($event)"></mui-pagination>',
      { imports: [Pagination], componentProperties: { handler } },
    );
    await userEvent.click(screen.getByRole('button', { name: 'Page 2' }));
    expect(handler).not.toHaveBeenCalled();
  });

  it('shows ellipsis when pages exceed threshold', async () => {
    await renderComponent(Pagination, { inputs: { totalPages: 10, page: 5 } });
    const ellipses = document.querySelectorAll('.pagination-ellipsis');
    expect(ellipses.length).toBeGreaterThan(0);
  });

  it('hides ellipsis from screen readers', async () => {
    await renderComponent(Pagination, { inputs: { totalPages: 10, page: 5 } });
    document.querySelectorAll('.pagination-ellipsis').forEach((el) => {
      expect(el).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('uses custom aria-label', async () => {
    await renderComponent(Pagination, { inputs: { totalPages: 5, ariaLabel: 'Product pages' } });
    expect(screen.getByRole('navigation', { name: 'Product pages' })).toBeInTheDocument();
  });

  it('exposes part="pagination"', async () => {
    await renderTemplate(
      '<mui-pagination [totalPages]="3"></mui-pagination>',
      { imports: [Pagination] },
    );
    expect(document.querySelector('mui-pagination')).toHaveAttribute('part', 'pagination');
  });
});
