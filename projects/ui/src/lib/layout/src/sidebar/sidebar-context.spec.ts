import { InjectionToken, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { SIDEBAR_CONTEXT } from './sidebar-context';
import type { SidebarContext } from './sidebar-context';

describe('SidebarContext', () => {
  it('SIDEBAR_CONTEXT is an InjectionToken', () => {
    expect(SIDEBAR_CONTEXT).toBeInstanceOf(InjectionToken);
  });

  it('resolves to the provided implementation when injected', () => {
    const ctx: SidebarContext = {
      expanded: signal(true),
      toggle: vi.fn(),
    };
    TestBed.configureTestingModule({ providers: [{ provide: SIDEBAR_CONTEXT, useValue: ctx }] });
    expect(TestBed.inject(SIDEBAR_CONTEXT)).toBe(ctx);
  });

  it('throws when injected without a provider', () => {
    TestBed.configureTestingModule({});
    expect(() => TestBed.inject(SIDEBAR_CONTEXT)).toThrow();
  });
});
