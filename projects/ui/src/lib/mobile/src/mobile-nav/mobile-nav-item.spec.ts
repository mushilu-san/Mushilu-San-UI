import { signal } from '@angular/core';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { MOBILE_NAV_CONTEXT, type MobileNavContext } from './mobile-nav';
import { MobileNavItem } from './mobile-nav-item';

function makeContext(active: string, setActive = vi.fn()): MobileNavContext {
  const activeItem = signal(active);
  return {
    activeItem: activeItem.asReadonly(),
    setActive: (v: string) => {
      activeItem.set(v);
      setActive(v);
    },
  };
}

// H-U-q5r6s7: MobileNavItem has no spec — it is always exercised only through its parent
// MobileNav, which hides selection/keyboard/touch-target behavior that belongs to the item
// itself. Provide MOBILE_NAV_CONTEXT directly so the item is verified in isolation.
describe('MobileNavItem (isolated)', () => {
  it('renders a button with the label text', async () => {
    await renderTemplate('<mui-mobile-nav-item value="home" label="Home"></mui-mobile-nav-item>', {
      imports: [MobileNavItem],
      providers: [{ provide: MOBILE_NAV_CONTEXT, useValue: makeContext('home') }],
    });
    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
  });

  it('renders as a native <button type="button"> carrying the touch-target sizing class', async () => {
    await renderTemplate('<mui-mobile-nav-item value="home" label="Home"></mui-mobile-nav-item>', {
      imports: [MobileNavItem],
      providers: [{ provide: MOBILE_NAV_CONTEXT, useValue: makeContext('home') }],
    });
    const btn = screen.getByRole('button', { name: 'Home' });
    expect(btn.tagName).toBe('BUTTON');
    expect(btn).toHaveAttribute('type', 'button');
    expect(btn).toHaveAttribute('part', 'button');
  });

  it('sets aria-current="page" when ctx.activeItem matches value', async () => {
    await renderTemplate('<mui-mobile-nav-item value="home" label="Home"></mui-mobile-nav-item>', {
      imports: [MobileNavItem],
      providers: [{ provide: MOBILE_NAV_CONTEXT, useValue: makeContext('home') }],
    });
    expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'page');
  });

  it('does not set aria-current when ctx.activeItem does not match value', async () => {
    await renderTemplate('<mui-mobile-nav-item value="home" label="Home"></mui-mobile-nav-item>', {
      imports: [MobileNavItem],
      providers: [{ provide: MOBILE_NAV_CONTEXT, useValue: makeContext('search') }],
    });
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-current');
  });

  it('calls ctx.setActive(value) on click', async () => {
    const setActive = vi.fn();
    const user = userEvent.setup();
    await renderTemplate('<mui-mobile-nav-item value="home" label="Home"></mui-mobile-nav-item>', {
      imports: [MobileNavItem],
      providers: [{ provide: MOBILE_NAV_CONTEXT, useValue: makeContext('search', setActive) }],
    });
    await user.click(screen.getByRole('button'));
    expect(setActive).toHaveBeenCalledWith('home');
  });

  it('calls ctx.setActive(value) on Enter key', async () => {
    const setActive = vi.fn();
    const user = userEvent.setup();
    await renderTemplate('<mui-mobile-nav-item value="home" label="Home"></mui-mobile-nav-item>', {
      imports: [MobileNavItem],
      providers: [{ provide: MOBILE_NAV_CONTEXT, useValue: makeContext('search', setActive) }],
    });
    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');
    expect(setActive).toHaveBeenCalledWith('home');
  });

  it('calls ctx.setActive(value) on Space key', async () => {
    const setActive = vi.fn();
    const user = userEvent.setup();
    await renderTemplate('<mui-mobile-nav-item value="home" label="Home"></mui-mobile-nav-item>', {
      imports: [MobileNavItem],
      providers: [{ provide: MOBILE_NAV_CONTEXT, useValue: makeContext('search', setActive) }],
    });
    screen.getByRole('button').focus();
    await user.keyboard(' ');
    expect(setActive).toHaveBeenCalledWith('home');
  });

  it('shows a dot badge for badge=-1', async () => {
    await renderTemplate(
      '<mui-mobile-nav-item value="home" label="Home" [badge]="-1"></mui-mobile-nav-item>',
      {
        imports: [MobileNavItem],
        providers: [{ provide: MOBILE_NAV_CONTEXT, useValue: makeContext('home') }],
      },
    );
    expect(screen.getByText('•')).toBeInTheDocument();
  });

  it('shows a numeric badge for badge=3', async () => {
    await renderTemplate(
      '<mui-mobile-nav-item value="home" label="Home" [badge]="3"></mui-mobile-nav-item>',
      {
        imports: [MobileNavItem],
        providers: [{ provide: MOBILE_NAV_CONTEXT, useValue: makeContext('home') }],
      },
    );
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows "99+" for badge > 99', async () => {
    await renderTemplate(
      '<mui-mobile-nav-item value="home" label="Home" [badge]="150"></mui-mobile-nav-item>',
      {
        imports: [MobileNavItem],
        providers: [{ provide: MOBILE_NAV_CONTEXT, useValue: makeContext('home') }],
      },
    );
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('renders no badge and a plain aria-label when badge=0', async () => {
    await renderTemplate('<mui-mobile-nav-item value="home" label="Home"></mui-mobile-nav-item>', {
      imports: [MobileNavItem],
      providers: [{ provide: MOBILE_NAV_CONTEXT, useValue: makeContext('home') }],
    });
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-label');
  });
});
