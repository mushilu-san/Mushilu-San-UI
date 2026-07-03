import { InjectionToken, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { NAV_MENU_CONTEXT, NAV_MENU_ITEM_CONTEXT } from './navigation-menu-context';
import type { NavMenuContext, NavMenuItemContext } from './navigation-menu-context';

describe('NAV_MENU_CONTEXT', () => {
  it('is an InjectionToken', () => {
    expect(NAV_MENU_CONTEXT).toBeInstanceOf(InjectionToken);
  });

  it('resolves to the provided implementation when injected', () => {
    const ctx: NavMenuContext = { openId: signal(null), setOpen: vi.fn() };
    TestBed.configureTestingModule({ providers: [{ provide: NAV_MENU_CONTEXT, useValue: ctx }] });
    expect(TestBed.inject(NAV_MENU_CONTEXT)).toBe(ctx);
  });

  it('throws when injected without a provider', () => {
    TestBed.configureTestingModule({});
    expect(() => TestBed.inject(NAV_MENU_CONTEXT)).toThrow();
  });
});

describe('NAV_MENU_ITEM_CONTEXT', () => {
  it('is an InjectionToken', () => {
    expect(NAV_MENU_ITEM_CONTEXT).toBeInstanceOf(InjectionToken);
  });

  it('resolves to the provided implementation when injected', () => {
    const ctx: NavMenuItemContext = { id: 'nav-item-1', isOpen: signal(false), toggle: vi.fn() };
    TestBed.configureTestingModule({
      providers: [{ provide: NAV_MENU_ITEM_CONTEXT, useValue: ctx }],
    });
    expect(TestBed.inject(NAV_MENU_ITEM_CONTEXT)).toBe(ctx);
  });

  it('throws when injected without a provider', () => {
    TestBed.configureTestingModule({});
    expect(() => TestBed.inject(NAV_MENU_ITEM_CONTEXT)).toThrow();
  });
});
