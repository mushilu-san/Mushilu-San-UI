import { describe, expect, it, vi } from 'vitest';
import { createDrag } from './create-drag';

function pointerEvent(type: string, init: PointerEventInit = {}): PointerEvent {
  return new PointerEvent(type, { bubbles: true, ...init });
}

describe('createDrag', () => {
  it('H-U-46cd7a: registers pointermove and pointerup listeners on the given document', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');
    createDrag(document, {});
    expect(addSpy).toHaveBeenCalledWith('pointermove', expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith('pointerup', expect.any(Function));
    addSpy.mockRestore();
  });

  it('H-U-46cd7a: calls onMove for each pointermove event', () => {
    const onMove = vi.fn();
    createDrag(document, { onMove });
    document.dispatchEvent(pointerEvent('pointermove', { clientX: 10 }));
    document.dispatchEvent(pointerEvent('pointermove', { clientX: 20 }));
    expect(onMove).toHaveBeenCalledTimes(2);
  });

  it('H-U-46cd7a: calls onEnd exactly once on pointerup', () => {
    const onEnd = vi.fn();
    createDrag(document, { onEnd });
    document.dispatchEvent(pointerEvent('pointerup'));
    expect(onEnd).toHaveBeenCalledOnce();
  });

  it('H-U-46cd7a: removes its listeners after pointerup so later events are ignored', () => {
    const onMove = vi.fn();
    const onEnd = vi.fn();
    createDrag(document, { onMove, onEnd });
    document.dispatchEvent(pointerEvent('pointerup'));
    document.dispatchEvent(pointerEvent('pointermove'));
    document.dispatchEvent(pointerEvent('pointerup'));
    expect(onMove).not.toHaveBeenCalled();
    expect(onEnd).toHaveBeenCalledOnce();
  });

  it('H-U-46cd7a: destroy() removes listeners before any pointerup fires', () => {
    const onMove = vi.fn();
    const onEnd = vi.fn();
    const session = createDrag(document, { onMove, onEnd });
    session.destroy();
    document.dispatchEvent(pointerEvent('pointermove'));
    document.dispatchEvent(pointerEvent('pointerup'));
    expect(onMove).not.toHaveBeenCalled();
    expect(onEnd).not.toHaveBeenCalled();
  });

  it('H-U-46cd7a: destroy() is safe to call more than once', () => {
    const session = createDrag(document, {});
    expect(() => {
      session.destroy();
      session.destroy();
    }).not.toThrow();
  });

  it('H-U-46cd7a: missing onMove/onEnd callbacks do not throw', () => {
    createDrag(document, {});
    expect(() => {
      document.dispatchEvent(pointerEvent('pointermove'));
      document.dispatchEvent(pointerEvent('pointerup'));
    }).not.toThrow();
  });

  it('H-U-46cd7a: two concurrent drag sessions do not interfere with each other', () => {
    const onEndA = vi.fn();
    const onEndB = vi.fn();
    const sessionA = createDrag(document, { onEnd: onEndA });
    createDrag(document, { onEnd: onEndB });
    sessionA.destroy();
    document.dispatchEvent(pointerEvent('pointerup'));
    expect(onEndA).not.toHaveBeenCalled();
    expect(onEndB).toHaveBeenCalledOnce();
  });
});
