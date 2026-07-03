import { InjectionToken, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { RESIZABLE_GROUP_CONTEXT } from './resizable-context';
import type { ResizableGroupContext } from './resizable-context';

describe('ResizableGroupContext', () => {
  it('RESIZABLE_GROUP_CONTEXT is an InjectionToken', () => {
    expect(RESIZABLE_GROUP_CONTEXT).toBeInstanceOf(InjectionToken);
  });

  it('resolves to the provided implementation when injected', () => {
    const ctx: ResizableGroupContext = {
      direction: signal('horizontal'),
      registerPanel: vi.fn(() => ({ idx: 0, size: signal(50) })),
      unregisterPanel: vi.fn(),
      startResize: vi.fn(),
      resizeByPercent: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: RESIZABLE_GROUP_CONTEXT, useValue: ctx }],
    });
    expect(TestBed.inject(RESIZABLE_GROUP_CONTEXT)).toBe(ctx);
  });

  it('throws when injected without a provider', () => {
    TestBed.configureTestingModule({});
    expect(() => TestBed.inject(RESIZABLE_GROUP_CONTEXT)).toThrow();
  });
});
