import { screen, fireEvent } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { NavigationMenu } from './navigation-menu';
import { NavigationMenuItem } from './navigation-menu-item';
import { NavigationMenuTrigger } from './navigation-menu-trigger';
import { NavigationMenuContent } from './navigation-menu-content';
import { NavigationMenuLink } from './navigation-menu-link';

const IMPORTS = [
  NavigationMenu, NavigationMenuItem,
  NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink,
];

const BASIC = `
  <mui-navigation-menu>
    <mui-navigation-menu-item>
      <button muiNavMenuTrigger>Products</button>
      <mui-navigation-menu-content>
        <a muiNavMenuLink href="#">Link 1</a>
        <a muiNavMenuLink href="#">Link 2</a>
      </mui-navigation-menu-content>
    </mui-navigation-menu-item>
    <mui-navigation-menu-item>
      <button muiNavMenuTrigger>Docs</button>
      <mui-navigation-menu-content>
        <a muiNavMenuLink href="#">API</a>
      </mui-navigation-menu-content>
    </mui-navigation-menu-item>
    <a muiNavMenuLink href="#">About</a>
  </mui-navigation-menu>
`;

function getMenu() {
  return document.querySelector('mui-navigation-menu') as HTMLElement;
}

function getTriggers() {
  return Array.from(document.querySelectorAll('[muiNavMenuTrigger]')) as HTMLButtonElement[];
}

function getContents() {
  return Array.from(document.querySelectorAll('mui-navigation-menu-content')) as HTMLElement[];
}

describe('NavigationMenu', () => {
  it('has role=navigation', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(getMenu()).toHaveAttribute('role', 'navigation');
  });

  it('has default aria-label', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(getMenu()).toHaveAttribute('aria-label', 'Main navigation');
  });

  it('custom label input', async () => {
    await renderTemplate(
      `<mui-navigation-menu label="Site navigation">
        <a muiNavMenuLink href="#">Home</a>
      </mui-navigation-menu>`,
      { imports: IMPORTS },
    );
    expect(getMenu()).toHaveAttribute('aria-label', 'Site navigation');
  });

  it('trigger has aria-expanded=false by default', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(getTriggers()[0]).toHaveAttribute('aria-expanded', 'false');
  });

  it('trigger has aria-haspopup=true', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(getTriggers()[0]).toHaveAttribute('aria-haspopup', 'true');
  });

  it('content is hidden by default', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(getContents()[0]).not.toHaveAttribute('data-open');
  });

  it('clicking trigger opens content', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.click(getTriggers()[0]);
    expect(getContents()[0]).toHaveAttribute('data-open');
    expect(getTriggers()[0]).toHaveAttribute('aria-expanded', 'true');
  });

  it('trigger gets data-open when panel is open', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.click(getTriggers()[0]);
    expect(getTriggers()[0]).toHaveAttribute('data-open');
  });

  it('clicking trigger again closes content', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    const trigger = getTriggers()[0];
    fireEvent.click(trigger);
    fireEvent.click(trigger);
    expect(getContents()[0]).not.toHaveAttribute('data-open');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opening a second panel closes the first', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    const [t1, t2] = getTriggers();
    fireEvent.click(t1);
    fireEvent.click(t2);
    expect(getContents()[0]).not.toHaveAttribute('data-open');
    expect(getContents()[1]).toHaveAttribute('data-open');
  });

  it('Escape closes open panel', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.click(getTriggers()[0]);
    fireEvent.keyDown(getMenu(), { key: 'Escape' });
    expect(getContents()[0]).not.toHaveAttribute('data-open');
  });

  it('clicking outside closes open panel', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.click(getTriggers()[0]);
    fireEvent.click(document.body);
    expect(getContents()[0]).not.toHaveAttribute('data-open');
  });

  it('link has aria-current=page when active', async () => {
    await renderTemplate(
      `<mui-navigation-menu>
        <a muiNavMenuLink href="#" [active]="true">Home</a>
      </mui-navigation-menu>`,
      { imports: IMPORTS },
    );
    expect(document.querySelector('[muiNavMenuLink]')).toHaveAttribute('aria-current', 'page');
  });

  it('inactive link has no aria-current', async () => {
    await renderTemplate(
      `<mui-navigation-menu>
        <a muiNavMenuLink href="#">About</a>
      </mui-navigation-menu>`,
      { imports: IMPORTS },
    );
    expect(document.querySelector('[muiNavMenuLink]')).not.toHaveAttribute('aria-current');
  });

  it('panel content is rendered when open', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.click(getTriggers()[0]);
    expect(screen.getByText('Link 1')).toBeInTheDocument();
  });

  it('panel content is removed from DOM when closed', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(screen.queryByText('Link 1')).not.toBeInTheDocument();
  });
});
