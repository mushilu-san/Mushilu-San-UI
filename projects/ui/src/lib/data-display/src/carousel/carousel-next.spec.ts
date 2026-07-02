import { signal } from '@angular/core';
import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { CAROUSEL_CONTEXT } from './carousel-context';
import type { CarouselContext } from './carousel-context';
import { CarouselNext } from './carousel-next';

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

// H-U-0231b5: CarouselNext has aria-label and aria-disabled in its template
// but no spec verifying that ARIA behavior.
describe('CarouselNext (isolated)', () => {
  it('renders a native button with aria-label="Next slide"', async () => {
    await renderTemplate('<button muiCarouselNext></button>', {
      imports: [CarouselNext],
      providers: [{ provide: CAROUSEL_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeInTheDocument();
  });

  it('aria-disabled is false when not on the last slide', async () => {
    await renderTemplate('<button muiCarouselNext></button>', {
      imports: [CarouselNext],
      providers: [
        { provide: CAROUSEL_CONTEXT, useValue: makeCtx({ active: signal(0), count: signal(3) }) },
      ],
    });
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'false');
  });

  it('aria-disabled is true on the last slide', async () => {
    await renderTemplate('<button muiCarouselNext></button>', {
      imports: [CarouselNext],
      providers: [
        { provide: CAROUSEL_CONTEXT, useValue: makeCtx({ active: signal(2), count: signal(3) }) },
      ],
    });
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });

  it('calls ctx.next() on click', async () => {
    const next = vi.fn();
    const user = userEvent.setup();
    await renderTemplate('<button muiCarouselNext></button>', {
      imports: [CarouselNext],
      providers: [{ provide: CAROUSEL_CONTEXT, useValue: makeCtx({ next }) }],
    });
    await user.click(screen.getByRole('button'));
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('still calls ctx.next() when aria-disabled (host disabled attribute is not set)', async () => {
    const next = vi.fn();
    await renderTemplate('<button muiCarouselNext></button>', {
      imports: [CarouselNext],
      providers: [
        {
          provide: CAROUSEL_CONTEXT,
          useValue: makeCtx({ next, active: signal(2), count: signal(3) }),
        },
      ],
    });
    const btn = screen.getByRole('button');
    expect(btn).not.toHaveAttribute('disabled');
    fireEvent.click(btn);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
