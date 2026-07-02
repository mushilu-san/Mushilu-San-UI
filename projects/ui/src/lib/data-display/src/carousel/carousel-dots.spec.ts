import { signal } from '@angular/core';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderComponent } from '../../../../core/testing';
import { CAROUSEL_CONTEXT } from './carousel-context';
import type { CarouselContext } from './carousel-context';
import { CarouselDots } from './carousel-dots';

function makeCtx(overrides: Partial<CarouselContext> = {}): CarouselContext {
  return {
    active: signal(0),
    count: signal(3),
    registerItem: vi.fn(() => 0),
    unregisterItem: vi.fn(),
    next: vi.fn(),
    prev: vi.fn(),
    goTo: vi.fn(),
    ...overrides,
  };
}

function getDots() {
  return screen.getAllByRole('tab');
}

// H-U-0a2c1f: CarouselDots has an aria-label per dot but no spec to verify
// button state/labels.
describe('CarouselDots (isolated)', () => {
  it('has role=tablist and aria-label="Slide navigation"', async () => {
    await renderComponent(CarouselDots, {
      providers: [{ provide: CAROUSEL_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-label', 'Slide navigation');
  });

  it('renders one tab per ctx.count()', async () => {
    await renderComponent(CarouselDots, {
      providers: [{ provide: CAROUSEL_CONTEXT, useValue: makeCtx({ count: signal(4) }) }],
    });
    expect(getDots().length).toBe(4);
  });

  it('each dot has a "Go to slide N" aria-label', async () => {
    await renderComponent(CarouselDots, {
      providers: [{ provide: CAROUSEL_CONTEXT, useValue: makeCtx() }],
    });
    const dots = getDots();
    expect(dots[0]).toHaveAttribute('aria-label', 'Go to slide 1');
    expect(dots[1]).toHaveAttribute('aria-label', 'Go to slide 2');
    expect(dots[2]).toHaveAttribute('aria-label', 'Go to slide 3');
  });

  it('the active dot has aria-selected=true, data-active, and tabindex=0', async () => {
    await renderComponent(CarouselDots, {
      providers: [{ provide: CAROUSEL_CONTEXT, useValue: makeCtx({ active: signal(1) }) }],
    });
    const dots = getDots();
    expect(dots[1]).toHaveAttribute('aria-selected', 'true');
    expect(dots[1]).toHaveAttribute('data-active');
    expect(dots[1]).toHaveAttribute('tabindex', '0');
  });

  it('inactive dots have aria-selected=false and tabindex=-1', async () => {
    await renderComponent(CarouselDots, {
      providers: [{ provide: CAROUSEL_CONTEXT, useValue: makeCtx({ active: signal(1) }) }],
    });
    const dots = getDots();
    expect(dots[0]).toHaveAttribute('aria-selected', 'false');
    expect(dots[0]).not.toHaveAttribute('data-active');
    expect(dots[0]).toHaveAttribute('tabindex', '-1');
    expect(dots[2]).toHaveAttribute('aria-selected', 'false');
    expect(dots[2]).toHaveAttribute('tabindex', '-1');
  });

  it('clicking a dot calls ctx.goTo(idx)', async () => {
    const goTo = vi.fn();
    const user = userEvent.setup();
    await renderComponent(CarouselDots, {
      providers: [{ provide: CAROUSEL_CONTEXT, useValue: makeCtx({ goTo }) }],
    });
    await user.click(getDots()[2]);
    expect(goTo).toHaveBeenCalledWith(2);
  });
});
