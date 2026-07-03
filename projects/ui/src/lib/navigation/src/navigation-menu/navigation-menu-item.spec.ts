import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { NAV_MENU_CONTEXT } from './navigation-menu-context';
import type { NavMenuContext } from './navigation-menu-context';
import { NavigationMenuItem } from './navigation-menu-item';

function makeRootCtx(openId: string | null = null): NavMenuContext {
  const _openId = signal(openId);
  return { openId: _openId.asReadonly(), setOpen: (id: string | null) => _openId.set(id) };
}

function getItem() {
  return document.querySelector('mui-navigation-menu-item') as HTMLElement;
}

describe('NavigationMenuItem (isolated)', () => {
  it('projects content', async () => {
    await renderTemplate('<mui-navigation-menu-item>Content</mui-navigation-menu-item>', {
      imports: [NavigationMenuItem],
      providers: [{ provide: NAV_MENU_CONTEXT, useValue: makeRootCtx() }],
    });
    expect(getItem()).toHaveTextContent('Content');
  });

  it('assigns a unique id per instance', async () => {
    const { fixture } = await renderTemplate(
      '<mui-navigation-menu-item></mui-navigation-menu-item>',
      {
        imports: [NavigationMenuItem],
        providers: [{ provide: NAV_MENU_CONTEXT, useValue: makeRootCtx() }],
      },
    );
    const instance = fixture.debugElement.query(By.directive(NavigationMenuItem))
      .componentInstance as NavigationMenuItem;
    expect(instance.id).toMatch(/^nav-item-/);
  });

  it('is closed by default (no data-open)', async () => {
    await renderTemplate('<mui-navigation-menu-item></mui-navigation-menu-item>', {
      imports: [NavigationMenuItem],
      providers: [{ provide: NAV_MENU_CONTEXT, useValue: makeRootCtx() }],
    });
    expect(getItem()).not.toHaveAttribute('data-open');
  });

  it('toggle() sets root.setOpen(this.id) when closed', async () => {
    const root = makeRootCtx();
    const { fixture } = await renderTemplate(
      '<mui-navigation-menu-item></mui-navigation-menu-item>',
      {
        imports: [NavigationMenuItem],
        providers: [{ provide: NAV_MENU_CONTEXT, useValue: root }],
      },
    );
    const instance = fixture.debugElement.query(By.directive(NavigationMenuItem))
      .componentInstance as NavigationMenuItem;
    instance.toggle();
    expect(root.openId()).toBe(instance.id);
  });

  it('toggle() closes it again when already open', async () => {
    const root = makeRootCtx();
    const { fixture } = await renderTemplate(
      '<mui-navigation-menu-item></mui-navigation-menu-item>',
      {
        imports: [NavigationMenuItem],
        providers: [{ provide: NAV_MENU_CONTEXT, useValue: root }],
      },
    );
    const instance = fixture.debugElement.query(By.directive(NavigationMenuItem))
      .componentInstance as NavigationMenuItem;
    instance.toggle();
    instance.toggle();
    expect(root.openId()).toBeNull();
  });

  it('reflects data-open when root.openId matches its id', async () => {
    const root = makeRootCtx();
    const { fixture, detectChanges } = await renderTemplate(
      '<mui-navigation-menu-item></mui-navigation-menu-item>',
      {
        imports: [NavigationMenuItem],
        providers: [{ provide: NAV_MENU_CONTEXT, useValue: root }],
      },
    );
    const instance = fixture.debugElement.query(By.directive(NavigationMenuItem))
      .componentInstance as NavigationMenuItem;
    root.setOpen(instance.id);
    detectChanges();
    expect(getItem()).toHaveAttribute('data-open');
  });

  it('exposes part="item"', async () => {
    await renderTemplate('<mui-navigation-menu-item></mui-navigation-menu-item>', {
      imports: [NavigationMenuItem],
      providers: [{ provide: NAV_MENU_CONTEXT, useValue: makeRootCtx() }],
    });
    expect(getItem()).toHaveAttribute('part', 'item');
  });
});
