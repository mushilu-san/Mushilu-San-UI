import { screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderComponent, renderTemplate } from '../../../../core/testing';
import { Breadcrumb } from './breadcrumb';
import type { BreadcrumbItem } from './breadcrumb.types';

const items: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Shoes' },
];

describe('Breadcrumb', () => {
  it('renders a nav landmark with label', async () => {
    await renderComponent(Breadcrumb, { inputs: { items } });
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });

  it('renders all item labels', async () => {
    await renderComponent(Breadcrumb, { inputs: { items } });
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Shoes')).toBeInTheDocument();
  });

  it('renders links for items with href (except last)', async () => {
    await renderComponent(Breadcrumb, { inputs: { items } });
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products');
  });

  it('does not render a link for the last item', async () => {
    await renderComponent(Breadcrumb, { inputs: { items } });
    expect(screen.queryByRole('link', { name: 'Shoes' })).toBeNull();
  });

  it('sets aria-current="page" on last item', async () => {
    await renderComponent(Breadcrumb, { inputs: { items } });
    const current = screen.getByText('Shoes');
    expect(current).toHaveAttribute('aria-current', 'page');
  });

  it('does not set aria-current on non-last items', async () => {
    await renderComponent(Breadcrumb, { inputs: { items } });
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });

  it('renders separator between items', async () => {
    await renderComponent(Breadcrumb, { inputs: { items } });
    const separators = document.querySelectorAll('.breadcrumb-separator');
    expect(separators).toHaveLength(2);
  });

  it('hides separators from screen readers', async () => {
    await renderComponent(Breadcrumb, { inputs: { items } });
    document.querySelectorAll('.breadcrumb-separator').forEach((sep) => {
      expect(sep).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('uses custom separator', async () => {
    await renderComponent(Breadcrumb, { inputs: { items, separator: '›' } });
    expect(document.querySelector('.breadcrumb-separator')?.textContent?.trim()).toBe('›');
  });

  it('renders single item with aria-current', async () => {
    await renderComponent(Breadcrumb, { inputs: { items: [{ label: 'Home' }] } });
    expect(screen.getByText('Home')).toHaveAttribute('aria-current', 'page');
  });

  it('renders an ordered list', async () => {
    await renderComponent(Breadcrumb, { inputs: { items } });
    expect(document.querySelector('ol')).toBeInTheDocument();
  });

  it('exposes part="breadcrumb"', async () => {
    await renderTemplate('<mui-breadcrumb [items]="items"></mui-breadcrumb>', {
      imports: [Breadcrumb],
      componentProperties: { items },
    });
    expect(document.querySelector('mui-breadcrumb')).toHaveAttribute('part', 'breadcrumb');
  });
});
