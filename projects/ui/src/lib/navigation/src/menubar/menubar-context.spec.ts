import { InjectionToken, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { MENUBAR_CONTEXT, MENUBAR_MENU_CONTEXT } from './menubar-context';
import type { MenubarContext, MenubarMenuContext } from './menubar-context';

describe('MENUBAR_CONTEXT', () => {
  it('is an InjectionToken', () => {
    expect(MENUBAR_CONTEXT).toBeInstanceOf(InjectionToken);
  });

  it('resolves to the provided implementation when injected', () => {
    const ctx: MenubarContext = { openId: signal(null), setOpen: vi.fn() };
    TestBed.configureTestingModule({ providers: [{ provide: MENUBAR_CONTEXT, useValue: ctx }] });
    expect(TestBed.inject(MENUBAR_CONTEXT)).toBe(ctx);
  });

  it('throws when injected without a provider', () => {
    TestBed.configureTestingModule({});
    expect(() => TestBed.inject(MENUBAR_CONTEXT)).toThrow();
  });
});

describe('MENUBAR_MENU_CONTEXT', () => {
  it('is an InjectionToken', () => {
    expect(MENUBAR_MENU_CONTEXT).toBeInstanceOf(InjectionToken);
  });

  it('resolves to the provided implementation when injected', () => {
    const ctx: MenubarMenuContext = { id: 'menu-1', isOpen: signal(false), toggle: vi.fn() };
    TestBed.configureTestingModule({
      providers: [{ provide: MENUBAR_MENU_CONTEXT, useValue: ctx }],
    });
    expect(TestBed.inject(MENUBAR_MENU_CONTEXT)).toBe(ctx);
  });

  it('throws when injected without a provider', () => {
    TestBed.configureTestingModule({});
    expect(() => TestBed.inject(MENUBAR_MENU_CONTEXT)).toThrow();
  });
});
