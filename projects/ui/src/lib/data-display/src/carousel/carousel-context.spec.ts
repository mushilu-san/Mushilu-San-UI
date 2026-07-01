import { InjectionToken, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { CAROUSEL_CONTEXT } from './carousel-context';
import type { CarouselContext } from './carousel-context';

describe('CarouselContext', () => {
  it('CAROUSEL_CONTEXT is an InjectionToken', () => {
    expect(CAROUSEL_CONTEXT).toBeInstanceOf(InjectionToken);
  });

  it('resolves to the provided implementation when injected', () => {
    const ctx: CarouselContext = {
      active: signal(0),
      count: signal(3),
      registerItem: vi.fn(() => 0),
      unregisterItem: vi.fn(),
      next: vi.fn(),
      prev: vi.fn(),
      goTo: vi.fn(),
    };
    TestBed.configureTestingModule({ providers: [{ provide: CAROUSEL_CONTEXT, useValue: ctx }] });
    expect(TestBed.inject(CAROUSEL_CONTEXT)).toBe(ctx);
  });

  it('throws when injected without a provider', () => {
    TestBed.configureTestingModule({});
    expect(() => TestBed.inject(CAROUSEL_CONTEXT)).toThrow();
  });
});
