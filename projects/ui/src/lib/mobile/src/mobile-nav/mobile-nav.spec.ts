import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { MobileNav } from './mobile-nav';
import { MobileNavItem } from './mobile-nav-item';

const imports = [MobileNav, MobileNavItem];

const basicTemplate = `
  <mui-mobile-nav [(activeItem)]="active">
    <mui-mobile-nav-item value="home" label="Home"></mui-mobile-nav-item>
    <mui-mobile-nav-item value="search" label="Search"></mui-mobile-nav-item>
    <mui-mobile-nav-item value="profile" label="Profile"></mui-mobile-nav-item>
  </mui-mobile-nav>
`;

describe('MobileNav', () => {
  it('renders a navigation landmark', async () => {
    await renderTemplate(basicTemplate, {
      imports,
      componentProperties: { active: 'home' },
    });
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders all items as buttons', async () => {
    await renderTemplate(basicTemplate, {
      imports,
      componentProperties: { active: 'home' },
    });
    const btns = screen.getAllByRole('button');
    expect(btns).toHaveLength(3);
  });

  it('marks the active item with aria-current="page"', async () => {
    await renderTemplate(basicTemplate, {
      imports,
      componentProperties: { active: 'search' },
    });
    expect(screen.getByRole('button', { name: 'Search' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });

  it('updates active item on click', async () => {
    const user = userEvent.setup();
    await renderTemplate(basicTemplate, {
      imports,
      componentProperties: { active: 'home' },
    });
    await user.click(screen.getByRole('button', { name: 'Profile' }));
    expect(screen.getByRole('button', { name: 'Profile' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });

  it('activates item via keyboard Enter', async () => {
    const user = userEvent.setup();
    await renderTemplate(basicTemplate, {
      imports,
      componentProperties: { active: 'home' },
    });
    const searchBtn = screen.getByRole('button', { name: 'Search' });
    searchBtn.focus();
    await user.keyboard('{Enter}');
    expect(searchBtn).toHaveAttribute('aria-current', 'page');
  });

  it('activates item via keyboard Space', async () => {
    const user = userEvent.setup();
    await renderTemplate(basicTemplate, {
      imports,
      componentProperties: { active: 'home' },
    });
    const profileBtn = screen.getByRole('button', { name: 'Profile' });
    profileBtn.focus();
    await user.keyboard(' ');
    expect(profileBtn).toHaveAttribute('aria-current', 'page');
  });

  it('shows badge count on item', async () => {
    await renderTemplate(
      `<mui-mobile-nav activeItem="home">
        <mui-mobile-nav-item value="home" label="Home" [badge]="3"></mui-mobile-nav-item>
      </mui-mobile-nav>`,
      { imports },
    );
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows 99+ for badge > 99', async () => {
    await renderTemplate(
      `<mui-mobile-nav activeItem="home">
        <mui-mobile-nav-item value="home" label="Home" [badge]="150"></mui-mobile-nav-item>
      </mui-mobile-nav>`,
      { imports },
    );
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('labels match aria-label when badge present', async () => {
    await renderTemplate(
      `<mui-mobile-nav activeItem="home">
        <mui-mobile-nav-item value="home" label="Inbox" [badge]="5"></mui-mobile-nav-item>
      </mui-mobile-nav>`,
      { imports },
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-label', 'Inbox, 5 notifications');
  });
});
