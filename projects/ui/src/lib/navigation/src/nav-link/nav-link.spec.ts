import { screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { NavLink } from './nav-link';

describe('NavLink', () => {
  it('renders anchor with muiNavLink', async () => {
    await renderTemplate('<a muiNavLink href="#">Home</a>', { imports: [NavLink] });
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
  });

  it('sets data-variant attribute', async () => {
    await renderTemplate('<a muiNavLink variant="primary" href="#">Nav</a>', { imports: [NavLink] });
    expect(document.querySelector('a[muiNavLink]')).toHaveAttribute('data-variant', 'primary');
  });

  it('sets data-size attribute', async () => {
    await renderTemplate('<a muiNavLink size="sm" href="#">Nav</a>', { imports: [NavLink] });
    expect(document.querySelector('a[muiNavLink]')).toHaveAttribute('data-size', 'sm');
  });

  it('sets aria-current="page" when active', async () => {
    await renderTemplate('<a muiNavLink active href="#">Current</a>', { imports: [NavLink] });
    expect(document.querySelector('a[muiNavLink]')).toHaveAttribute('aria-current', 'page');
  });

  it('sets data-active when active', async () => {
    await renderTemplate('<a muiNavLink active href="#">Current</a>', { imports: [NavLink] });
    expect(document.querySelector('a[muiNavLink]')).toHaveAttribute('data-active');
  });

  it('does not set aria-current when not active', async () => {
    await renderTemplate('<a muiNavLink href="#">Nav</a>', { imports: [NavLink] });
    expect(document.querySelector('a[muiNavLink]')).not.toHaveAttribute('aria-current');
  });

  it('does not set data-active when not active', async () => {
    await renderTemplate('<a muiNavLink href="#">Nav</a>', { imports: [NavLink] });
    expect(document.querySelector('a[muiNavLink]')).not.toHaveAttribute('data-active');
  });

  it('defaults to md size', async () => {
    await renderTemplate('<a muiNavLink href="#">Nav</a>', { imports: [NavLink] });
    expect(document.querySelector('a[muiNavLink]')).toHaveAttribute('data-size', 'md');
  });

  it('defaults to default variant', async () => {
    await renderTemplate('<a muiNavLink href="#">Nav</a>', { imports: [NavLink] });
    expect(document.querySelector('a[muiNavLink]')).toHaveAttribute('data-variant', 'default');
  });

  it('exposes part="nav-link"', async () => {
    await renderTemplate('<a muiNavLink href="#">Nav</a>', { imports: [NavLink] });
    expect(document.querySelector('a[muiNavLink]')).toHaveAttribute('part', 'nav-link');
  });
});
