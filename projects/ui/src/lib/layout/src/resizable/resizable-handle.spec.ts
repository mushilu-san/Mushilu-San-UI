import { signal } from '@angular/core';
import { fireEvent, screen } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { RESIZABLE_GROUP_CONTEXT } from './resizable-context';
import type { ResizableGroupContext } from './resizable-context';
import { ResizableHandle } from './resizable-handle';

function makeCtx(direction: 'horizontal' | 'vertical' = 'horizontal'): ResizableGroupContext {
  return {
    direction: signal(direction),
    registerPanel: vi.fn(() => ({ idx: 0, size: signal(50) })),
    unregisterPanel: vi.fn(),
    startResize: vi.fn(),
    resizeByPercent: vi.fn(),
  };
}

describe('ResizableHandle (isolated)', () => {
  it('H-U-0967c7: renders with role=separator', async () => {
    await renderTemplate('<mui-resizable-handle></mui-resizable-handle>', {
      imports: [ResizableHandle],
      providers: [{ provide: RESIZABLE_GROUP_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('H-U-0967c7: pointerdown calls ctx.startResize with the pointer event and host element', async () => {
    const ctx = makeCtx();
    await renderTemplate('<mui-resizable-handle></mui-resizable-handle>', {
      imports: [ResizableHandle],
      providers: [{ provide: RESIZABLE_GROUP_CONTEXT, useValue: ctx }],
    });
    const handle = screen.getByRole('separator');
    fireEvent.pointerDown(handle, { clientX: 10, pointerId: 1 });
    expect(ctx.startResize).toHaveBeenCalledOnce();
    const [event, el] = (ctx.startResize as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(event).toBeInstanceOf(Event);
    expect(el).toBe(handle);
  });

  it('H-U-0967c7: pointerdown prevents the default browser drag/selection behavior', async () => {
    await renderTemplate('<mui-resizable-handle></mui-resizable-handle>', {
      imports: [ResizableHandle],
      providers: [{ provide: RESIZABLE_GROUP_CONTEXT, useValue: makeCtx() }],
    });
    const notCancelled = fireEvent.pointerDown(screen.getByRole('separator'), {
      clientX: 10,
      pointerId: 1,
    });
    expect(notCancelled).toBe(false);
  });

  it('H-U-0967c7: ArrowRight calls ctx.resizeByPercent with a positive delta in horizontal orientation', async () => {
    const ctx = makeCtx('horizontal');
    await renderTemplate('<mui-resizable-handle></mui-resizable-handle>', {
      imports: [ResizableHandle],
      providers: [{ provide: RESIZABLE_GROUP_CONTEXT, useValue: ctx }],
    });
    fireEvent.keyDown(screen.getByRole('separator'), { key: 'ArrowRight' });
    expect(ctx.resizeByPercent).toHaveBeenCalledWith(screen.getByRole('separator'), 1);
  });

  it('H-U-0967c7: ArrowLeft calls ctx.resizeByPercent with a negative delta in horizontal orientation', async () => {
    const ctx = makeCtx('horizontal');
    await renderTemplate('<mui-resizable-handle></mui-resizable-handle>', {
      imports: [ResizableHandle],
      providers: [{ provide: RESIZABLE_GROUP_CONTEXT, useValue: ctx }],
    });
    fireEvent.keyDown(screen.getByRole('separator'), { key: 'ArrowLeft' });
    expect(ctx.resizeByPercent).toHaveBeenCalledWith(screen.getByRole('separator'), -1);
  });

  it('H-U-0967c7: Shift+ArrowRight moves by a 10-percent step', async () => {
    const ctx = makeCtx('horizontal');
    await renderTemplate('<mui-resizable-handle></mui-resizable-handle>', {
      imports: [ResizableHandle],
      providers: [{ provide: RESIZABLE_GROUP_CONTEXT, useValue: ctx }],
    });
    fireEvent.keyDown(screen.getByRole('separator'), { key: 'ArrowRight', shiftKey: true });
    expect(ctx.resizeByPercent).toHaveBeenCalledWith(screen.getByRole('separator'), 10);
  });

  it('H-U-0967c7: ArrowDown/ArrowUp drive resizing in vertical orientation instead', async () => {
    const ctx = makeCtx('vertical');
    await renderTemplate('<mui-resizable-handle></mui-resizable-handle>', {
      imports: [ResizableHandle],
      providers: [{ provide: RESIZABLE_GROUP_CONTEXT, useValue: ctx }],
    });
    fireEvent.keyDown(screen.getByRole('separator'), { key: 'ArrowRight' });
    expect(ctx.resizeByPercent).not.toHaveBeenCalled();
    fireEvent.keyDown(screen.getByRole('separator'), { key: 'ArrowDown' });
    expect(ctx.resizeByPercent).toHaveBeenCalledWith(screen.getByRole('separator'), 1);
  });

  it('H-U-0967c7: ignores unrelated keys', async () => {
    const ctx = makeCtx();
    await renderTemplate('<mui-resizable-handle></mui-resizable-handle>', {
      imports: [ResizableHandle],
      providers: [{ provide: RESIZABLE_GROUP_CONTEXT, useValue: ctx }],
    });
    fireEvent.keyDown(screen.getByRole('separator'), { key: 'Tab' });
    expect(ctx.resizeByPercent).not.toHaveBeenCalled();
  });
});
