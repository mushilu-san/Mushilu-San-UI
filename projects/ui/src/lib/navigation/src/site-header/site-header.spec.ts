import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { SiteHeader } from './site-header';

const TEMPLATE = `
  <mui-site-header>
    <a slot="brand" href="/">Loom</a>
    <a href="/blog">Blog</a>
    <a href="/about">About</a>
  </mui-site-header>`;

const button = () => screen.getByRole('button', { name: 'Menu' });

describe('SiteHeader', () => {
  it('renders a banner with a labelled navigation landmark', async () => {
    await renderTemplate(TEMPLATE, { imports: [SiteHeader] });
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(document.querySelector('nav')).toHaveAttribute('aria-label', 'Main');
  });

  it('menu button starts collapsed and points at the nav with aria-controls', async () => {
    await renderTemplate(TEMPLATE, { imports: [SiteHeader] });
    expect(button()).toHaveAttribute('aria-expanded', 'false');
    const nav = document.querySelector('nav') as HTMLElement;
    expect(button()).toHaveAttribute('aria-controls', nav.id);
    expect(nav.id).toMatch(/^mui-site-header-nav-/);
  });

  it('click toggles aria-expanded and the data-open host flag', async () => {
    await renderTemplate(TEMPLATE, { imports: [SiteHeader] });
    await userEvent.click(button());
    expect(button()).toHaveAttribute('aria-expanded', 'true');
    expect(document.querySelector('mui-site-header')).toHaveAttribute('data-open');
    await userEvent.click(button());
    expect(button()).toHaveAttribute('aria-expanded', 'false');
  });

  it('Escape closes the menu and returns focus to the button', async () => {
    await renderTemplate(TEMPLATE, { imports: [SiteHeader] });
    await userEvent.click(button());
    screen.getByRole('link', { name: 'Blog' }).focus();
    await userEvent.keyboard('{Escape}');
    expect(button()).toHaveAttribute('aria-expanded', 'false');
    expect(button()).toHaveFocus();
  });

  it('Escape does nothing while closed', async () => {
    await renderTemplate(TEMPLATE, { imports: [SiteHeader] });
    button().focus();
    await userEvent.keyboard('{Escape}');
    expect(button()).toHaveFocus();
    expect(button()).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes when a link in the menu is followed', async () => {
    await renderTemplate(TEMPLATE, { imports: [SiteHeader] });
    await userEvent.click(button());
    const link = screen.getByRole('link', { name: 'About' });
    link.addEventListener('click', (e) => e.preventDefault());
    await userEvent.click(link);
    expect(button()).toHaveAttribute('aria-expanded', 'false');
  });

  it('takes translated labels', async () => {
    await renderTemplate(
      '<mui-site-header menuLabel="תפריט" navLabel="ראשי"><a href="/">x</a></mui-site-header>',
      { imports: [SiteHeader] },
    );
    expect(screen.getByRole('button', { name: 'תפריט' })).toBeInTheDocument();
    expect(document.querySelector('nav')).toHaveAttribute('aria-label', 'ראשי');
  });

  it('supports two-way [(open)]', async () => {
    await renderTemplate('<mui-site-header [(open)]="isOpen"><a href="/">x</a></mui-site-header>', {
      imports: [SiteHeader],
      componentProperties: { isOpen: true },
    });
    expect(button()).toHaveAttribute('aria-expanded', 'true');
  });
});
