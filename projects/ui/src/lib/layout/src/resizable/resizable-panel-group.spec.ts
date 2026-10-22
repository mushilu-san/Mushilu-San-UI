import { fireEvent } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';
import { renderComponent } from '../../../../core/testing';
import { ResizablePanelGroup } from './resizable-panel-group';

/** Renders the group alone and registers two (or n) panels straight on the instance. */
async function setup(opts: { direction?: 'horizontal' | 'vertical'; dir?: 'rtl' | 'ltr' } = {}) {
  const { fixture, detectChanges } = await renderComponent(ResizablePanelGroup, {
    inputs: { direction: opts.direction ?? 'horizontal' },
  });
  const group = fixture.componentInstance;
  const host = fixture.nativeElement as HTMLElement;
  if (opts.dir) host.setAttribute('dir', opts.dir);
  vi.spyOn(host, 'getBoundingClientRect').mockReturnValue({ width: 1000, height: 500 } as DOMRect);

  // Handle sits between two sibling elements, as in the real layout (panel, handle, panel).
  const parent = document.createElement('div');
  const handle = document.createElement('div');
  parent.append(document.createElement('div'), handle, document.createElement('div'));
  host.append(parent);

  const a = group.registerPanel(50, 10, 90);
  const b = group.registerPanel(50, 10, 90);
  return { group, host, handle, a, b, detectChanges };
}

describe('ResizablePanelGroup (isolated)', () => {
  describe('panel registry', () => {
    it('normalizes default sizes to 100% across registered panels', async () => {
      const { group } = await setup();
      const c = group.registerPanel(100, 10, 90); // 50 + 50 + 100 -> 25 / 25 / 50
      expect(c.size()).toBeCloseTo(50);
    });

    it('unregisterPanel removes the entry and renormalizes the remaining panels', async () => {
      const { group, a, b } = await setup();
      group.unregisterPanel(a);
      expect(b.size()).toBeCloseTo(100);
    });

    it('unregisterPanel is a no-op for an unknown or already-removed registration', async () => {
      const { group, a, b } = await setup();
      group.unregisterPanel(a);
      expect(() => group.unregisterPanel(a)).not.toThrow();
      expect(b.size()).toBeCloseTo(100);
    });

    it('a removed panel falls back to its default size', async () => {
      const { group, a } = await setup();
      group.unregisterPanel(a);
      expect(a.size()).toBe(50);
    });
  });

  describe('pointer drag', () => {
    it('captures the pointer on the handle and applies the delta as a percentage', async () => {
      const { group, handle, a, b } = await setup();
      const capture = vi.fn();
      handle.setPointerCapture = capture;
      group.startResize(new PointerEvent('pointerdown', { clientX: 500, pointerId: 7 }), handle);
      expect(capture).toHaveBeenCalledWith(7);
      fireEvent.pointerMove(document, { clientX: 600, pointerId: 7 });
      expect(a.size()).toBeCloseTo(60);
      expect(b.size()).toBeCloseTo(40);
    });

    it('uses clientY and container height for vertical groups', async () => {
      const { group, handle, a } = await setup({ direction: 'vertical' });
      group.startResize(new PointerEvent('pointerdown', { clientY: 250, pointerId: 1 }), handle);
      fireEvent.pointerMove(document, { clientY: 300, pointerId: 1 });
      expect(a.size()).toBeCloseTo(60); // 50px of a 500px container = 10%
    });

    it('flips the sign for horizontal drags under RTL', async () => {
      const { group, handle, a } = await setup({ dir: 'rtl' });
      group.startResize(new PointerEvent('pointerdown', { clientX: 500, pointerId: 1 }), handle);
      fireEvent.pointerMove(document, { clientX: 600, pointerId: 1 });
      expect(a.size()).toBeCloseTo(40);
    });

    it('does not flip the sign for horizontal drags under LTR', async () => {
      const { group, handle, a } = await setup({ dir: 'ltr' });
      group.startResize(new PointerEvent('pointerdown', { clientX: 500, pointerId: 1 }), handle);
      fireEvent.pointerMove(document, { clientX: 600, pointerId: 1 });
      expect(a.size()).toBeCloseTo(60);
    });

    it('clamps to the min/max of the neighbouring panels', async () => {
      const { group, handle, a, b } = await setup();
      group.startResize(new PointerEvent('pointerdown', { clientX: 0, pointerId: 1 }), handle);
      fireEvent.pointerMove(document, { clientX: 5000, pointerId: 1 });
      expect(a.size()).toBe(90);
      expect(b.size()).toBe(10);
    });

    it('ignores pointer moves after pointerup', async () => {
      const { group, handle, a } = await setup();
      group.startResize(new PointerEvent('pointerdown', { clientX: 500, pointerId: 1 }), handle);
      fireEvent.pointerMove(document, { clientX: 600, pointerId: 1 });
      fireEvent.pointerUp(document, { pointerId: 1 });
      fireEvent.pointerMove(document, { clientX: 800, pointerId: 1 });
      expect(a.size()).toBeCloseTo(60);
    });

    it('does nothing when the container has zero size', async () => {
      const { group, host, handle, a } = await setup();
      vi.spyOn(host, 'getBoundingClientRect').mockReturnValue({ width: 0, height: 0 } as DOMRect);
      group.startResize(new PointerEvent('pointerdown', { clientX: 500, pointerId: 1 }), handle);
      fireEvent.pointerMove(document, { clientX: 600, pointerId: 1 });
      expect(a.size()).toBeCloseTo(50);
    });

    it('early-returns with an empty registry (no panel before/after the handle)', async () => {
      const { group, handle, a, b } = await setup();
      group.unregisterPanel(a);
      group.unregisterPanel(b);
      const capture = vi.fn();
      handle.setPointerCapture = capture;
      group.startResize(new PointerEvent('pointerdown', { clientX: 500, pointerId: 1 }), handle);
      expect(capture).not.toHaveBeenCalled();
    });

    it('early-returns for a detached handle', async () => {
      const { group } = await setup();
      const orphan = document.createElement('div');
      orphan.setPointerCapture = vi.fn();
      group.startResize(new PointerEvent('pointerdown', { pointerId: 1 }), orphan);
      expect(orphan.setPointerCapture).not.toHaveBeenCalled();
    });

    it('destroy removes the document pointer listeners', async () => {
      const { group, handle, a, detectChanges } = await setup();
      group.startResize(new PointerEvent('pointerdown', { clientX: 500, pointerId: 1 }), handle);
      group.ngOnDestroy();
      fireEvent.pointerMove(document, { clientX: 700, pointerId: 1 });
      detectChanges();
      expect(a.size()).toBeCloseTo(50);
    });
  });

  describe('keyboard API', () => {
    it('resizeByPercent grows the panel before the handle and handleValue reports it', async () => {
      const { group, handle, a } = await setup();
      group.resizeByPercent(handle, 10);
      expect(a.size()).toBeCloseTo(60);
      expect(group.handleValue(handle)).toBe(60);
    });

    it('handleValue is 0 for a handle with no panel before it', async () => {
      const { group } = await setup();
      expect(group.handleValue(document.createElement('div'))).toBe(0);
    });
  });
});
