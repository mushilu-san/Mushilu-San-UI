import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { MENUBAR_CONTEXT, type MenubarContext } from './menubar-context';
import { MenubarMenu } from './menubar-menu';

function makeRootContext(openId: string | null = null): MenubarContext {
  const _openId = signal(openId);
  return {
    openId: _openId.asReadonly(),
    setOpen: (id: string | null) => _openId.set(id),
  };
}

function getMenus() {
  return Array.from(document.querySelectorAll('mui-menubar-menu')) as HTMLElement[];
}

// H-U-n2o3p4: MenubarMenu has no spec — it is always exercised only through the full
// <mui-menubar> tree in menubar.spec.ts, which never verifies MenubarMenu's own id
// generation, isOpen/toggle contract, or that it projects nested content. Provide
// MENUBAR_CONTEXT directly so MenubarMenu is verified in isolation.
describe('MenubarMenu (isolated)', () => {
  it('projects nested content', async () => {
    await renderTemplate(
      `<mui-menubar-menu><button id="trigger">File</button><div id="content">Content</div></mui-menubar-menu>`,
      {
        imports: [MenubarMenu],
        providers: [{ provide: MENUBAR_CONTEXT, useValue: makeRootContext() }],
      },
    );
    expect(document.querySelector('#trigger')).toBeInTheDocument();
    expect(document.querySelector('#content')).toBeInTheDocument();
  });

  it('is closed by default (no data-open attribute)', async () => {
    await renderTemplate(`<mui-menubar-menu></mui-menubar-menu>`, {
      imports: [MenubarMenu],
      providers: [{ provide: MENUBAR_CONTEXT, useValue: makeRootContext() }],
    });
    expect(getMenus()[0]).not.toHaveAttribute('data-open');
  });

  it('reflects data-open when root.openId matches its id', async () => {
    const root = makeRootContext();
    const { detectChanges } = await renderTemplate(`<mui-menubar-menu></mui-menubar-menu>`, {
      imports: [MenubarMenu],
      providers: [{ provide: MENUBAR_CONTEXT, useValue: root }],
    });
    const capturedId = getMenus()[0].dataset['menubarMenuId'] ?? '';
    expect(capturedId).toBeTruthy();
    root.setOpen(capturedId);
    detectChanges();
    expect(getMenus()[0]).toHaveAttribute('data-open');
  });

  it('does not reflect data-open when root.openId is a different id', async () => {
    const root = makeRootContext('some-other-menu-id');
    await renderTemplate(`<mui-menubar-menu></mui-menubar-menu>`, {
      imports: [MenubarMenu],
      providers: [{ provide: MENUBAR_CONTEXT, useValue: root }],
    });
    expect(getMenus()[0]).not.toHaveAttribute('data-open');
  });

  it('assigns a unique data-menubar-menu-id per instance', async () => {
    await renderTemplate(
      `<mui-menubar-menu></mui-menubar-menu><mui-menubar-menu></mui-menubar-menu>`,
      {
        imports: [MenubarMenu],
        providers: [{ provide: MENUBAR_CONTEXT, useValue: makeRootContext() }],
      },
    );
    const [a, b] = getMenus();
    expect(a.dataset['menubarMenuId']).toBeTruthy();
    expect(b.dataset['menubarMenuId']).toBeTruthy();
    expect(a.dataset['menubarMenuId']).not.toBe(b.dataset['menubarMenuId']);
  });

  it('has part="menu"', async () => {
    await renderTemplate(`<mui-menubar-menu></mui-menubar-menu>`, {
      imports: [MenubarMenu],
      providers: [{ provide: MENUBAR_CONTEXT, useValue: makeRootContext() }],
    });
    expect(getMenus()[0]).toHaveAttribute('part', 'menu');
  });

  it('toggle() opens the menu when closed', async () => {
    const root = makeRootContext();
    const { fixture } = await renderTemplate(`<mui-menubar-menu></mui-menubar-menu>`, {
      imports: [MenubarMenu],
      providers: [{ provide: MENUBAR_CONTEXT, useValue: root }],
    });
    const menuInstance = fixture.debugElement.query(By.directive(MenubarMenu))
      .componentInstance as MenubarMenu;
    menuInstance.toggle();
    expect(root.openId()).toBe(menuInstance.id);
  });

  it('toggle() closes the menu when already open', async () => {
    const root = makeRootContext();
    const { fixture } = await renderTemplate(`<mui-menubar-menu></mui-menubar-menu>`, {
      imports: [MenubarMenu],
      providers: [{ provide: MENUBAR_CONTEXT, useValue: root }],
    });
    const menuInstance = fixture.debugElement.query(By.directive(MenubarMenu))
      .componentInstance as MenubarMenu;
    menuInstance.toggle();
    expect(root.openId()).toBe(menuInstance.id);
    menuInstance.toggle();
    expect(root.openId()).toBeNull();
  });
});
