import { signal } from '@angular/core';
import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { CAROUSEL_CONTEXT } from './carousel-context';
import type { CarouselContext } from './carousel-context';
import { CarouselPrev } from './carousel-prev';

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

// H-U-e4a9f2: CarouselPrev has aria-label and aria-disabled in its template
// but no spec verifying that ARIA behavior.
describe('CarouselPrev (isolated)', () => {
  it('renders a native button with aria-label="Previous slide"', async () => {
    await renderTemplate('<button muiCarouselPrev></button>', {
      imports: [CarouselPrev],
      providers: [{ provide: CAROUSEL_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeInTheDocument();
  });

  it('aria-disabled is true on the first slide', async () => {
    await renderTemplate('<button muiCarouselPrev></button>', {
      imports: [CarouselPrev],
      providers: [
        { provide: CAROUSEL_CONTEXT, useValue: makeCtx({ active: signal(0), count: signal(3) }) },
      ],
    });
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });

  it('aria-disabled is false when not on the first slide', async () => {
    await renderTemplate('<button muiCarouselPrev></button>', {
      imports: [CarouselPrev],
      providers: [
        { provide: CAROUSEL_CONTEXT, useValue: makeCtx({ active: signal(1), count: signal(3) }) },
      ],
    });
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'false');
  });

  it('calls ctx.prev() on click', async () => {
    const prev = vi.fn();
    const user = userEvent.setup();
    await renderTemplate('<button muiCarouselPrev></button>', {
      imports: [CarouselPrev],
      providers: [
        {
          provide: CAROUSEL_CONTEXT,
          useValue: makeCtx({ prev, active: signal(1), count: signal(3) }),
        },
      ],
    });
    await user.click(screen.getByRole('button'));
    expect(prev).toHaveBeenCalledTimes(1);
  });

  it('still calls ctx.prev() when aria-disabled (host disabled attribute is not set)', async () => {
    const prev = vi.fn();
    await renderTemplate('<button muiCarouselPrev></button>', {
      imports: [CarouselPrev],
      providers: [{ provide: CAROUSEL_CONTEXT, useValue: makeCtx({ prev }) }],
    });
    const btn = screen.getByRole('button');
    expect(btn).not.toHaveAttribute('disabled');
    fireEvent.click(btn);
    expect(prev).toHaveBeenCalledTimes(1);
  });
});
