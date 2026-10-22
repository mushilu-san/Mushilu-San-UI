import { signal } from '@angular/core';
import { screen } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { CAROUSEL_CONTEXT } from './carousel-context';
import type { CarouselContext } from './carousel-context';
import { CarouselItem } from './carousel-item';

function makeCtx(overrides: Partial<CarouselContext> = {}): CarouselContext {
  return {
    active: signal(0),
    count: signal(1),
    registerItem: vi.fn(() => 0),
    unregisterItem: vi.fn(),
    indexOf: vi.fn(() => 0),
    next: vi.fn(),
    prev: vi.fn(),
    goTo: vi.fn(),
    ...overrides,
  };
}

describe('CarouselItem', () => {
  it('registers itself with the context on init and uses the returned index', async () => {
    const ctx = makeCtx({ indexOf: vi.fn(() => 2), active: signal(2), count: signal(5) });
    await renderTemplate('<mui-carousel-item>Slide</mui-carousel-item>', {
      imports: [CarouselItem],
      providers: [{ provide: CAROUSEL_CONTEXT, useValue: ctx }],
    });
    expect(ctx.registerItem).toHaveBeenCalledOnce();
    expect(ctx.registerItem).toHaveBeenCalledWith(expect.any(CarouselItem));
    expect(screen.getByRole('group')).toHaveAttribute('aria-label', 'Slide 3 of 5');
  });

  it('is active when ctx.active() matches its registered index', async () => {
    const ctx = makeCtx({ indexOf: vi.fn(() => 1), active: signal(1), count: signal(3) });
    await renderTemplate('<mui-carousel-item>Slide</mui-carousel-item>', {
      imports: [CarouselItem],
      providers: [{ provide: CAROUSEL_CONTEXT, useValue: ctx }],
    });
    expect(screen.getByRole('group')).toHaveAttribute('data-active', '');
    expect(screen.getByRole('group')).toHaveAttribute('aria-hidden', 'false');
  });

  it('is not active when ctx.active() does not match its registered index', async () => {
    const ctx = makeCtx({ indexOf: vi.fn(() => 0), active: signal(1), count: signal(3) });
    await renderTemplate('<mui-carousel-item>Slide</mui-carousel-item>', {
      imports: [CarouselItem],
      providers: [{ provide: CAROUSEL_CONTEXT, useValue: ctx }],
    });
    expect(screen.getByRole('group', { hidden: true })).not.toHaveAttribute('data-active');
    expect(screen.getByRole('group', { hidden: true })).toHaveAttribute('aria-hidden', 'true');
  });

  it('H-A-b028b8: inactive slides are inert so focusable content is not tabbable; active is not', async () => {
    const ctx = makeCtx({ indexOf: vi.fn(() => 0), active: signal(1), count: signal(3) });
    const { fixture } = await renderTemplate(
      '<mui-carousel-item><button>in slide</button></mui-carousel-item>',
      { imports: [CarouselItem], providers: [{ provide: CAROUSEL_CONTEXT, useValue: ctx }] },
    );
    const el = screen.getByRole('group', { hidden: true });
    expect(el).toHaveAttribute('inert');
    (ctx.active as ReturnType<typeof signal<number>>).set(0);
    fixture.detectChanges();
    expect(el).not.toHaveAttribute('inert');
  });

  it('has aria-roledescription="slide"', async () => {
    const ctx = makeCtx();
    await renderTemplate('<mui-carousel-item>Slide</mui-carousel-item>', {
      imports: [CarouselItem],
      providers: [{ provide: CAROUSEL_CONTEXT, useValue: ctx }],
    });
    expect(screen.getByRole('group')).toHaveAttribute('aria-roledescription', 'slide');
  });

  it('unregisters itself from the context on destroy', async () => {
    const ctx = makeCtx();
    const { fixture } = await renderTemplate('<mui-carousel-item>Slide</mui-carousel-item>', {
      imports: [CarouselItem],
      providers: [{ provide: CAROUSEL_CONTEXT, useValue: ctx }],
    });
    fixture.destroy();
    expect(ctx.unregisterItem).toHaveBeenCalledOnce();
  });
});
