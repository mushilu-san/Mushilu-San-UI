import { screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { NavigationMenuLink } from './navigation-menu-link';

describe('NavigationMenuLink (isolated)', () => {
  it('renders on an anchor with role=link', async () => {
    await renderTemplate('<a muiNavMenuLink href="#">Home</a>', {
      imports: [NavigationMenuLink],
    });
    expect(screen.getByRole('link')).toHaveTextContent('Home');
  });

  it('sets aria-current="page" and data-active when active', async () => {
    await renderTemplate('<a muiNavMenuLink href="#" active>Home</a>', {
      imports: [NavigationMenuLink],
    });
    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link')).toHaveAttribute('data-active');
  });

  it('omits aria-current and data-active when not active', async () => {
    await renderTemplate('<a muiNavMenuLink href="#">Home</a>', {
      imports: [NavigationMenuLink],
    });
    expect(screen.getByRole('link')).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link')).not.toHaveAttribute('data-active');
  });

  it('exposes part="link"', async () => {
    await renderTemplate('<a muiNavMenuLink href="#">Home</a>', {
      imports: [NavigationMenuLink],
    });
    expect(screen.getByRole('link')).toHaveAttribute('part', 'link');
  });

  it('is focusable via Tab (native anchor with href)', async () => {
    await renderTemplate('<a muiNavMenuLink href="#">Home</a>', {
      imports: [NavigationMenuLink],
    });
    screen.getByRole('link').focus();
    expect(document.activeElement).toBe(screen.getByRole('link'));
  });
});
