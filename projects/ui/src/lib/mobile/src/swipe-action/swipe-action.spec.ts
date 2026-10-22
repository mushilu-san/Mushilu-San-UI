import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { SwipeAction } from './swipe-action';
import type { SwipeActionItem } from './swipe-action.types';

const rightActions: SwipeActionItem[] = [
  { key: 'delete', label: 'Delete', side: 'right', color: 'danger' },
  { key: 'archive', label: 'Archive', side: 'right', color: 'primary' },
];

const leftActions: SwipeActionItem[] = [
  { key: 'star', label: 'Star', side: 'left', color: 'warning' },
];

describe('SwipeAction', () => {
  it('renders row content', async () => {
    await renderTemplate(
      `<mui-swipe-action [actions]="actions"><span>Row text</span></mui-swipe-action>`,
      { imports: [SwipeAction], componentProperties: { actions: rightActions } },
    );
    expect(screen.getByText('Row text')).toBeInTheDocument();
  });

  it('renders accessible action buttons in the DOM', async () => {
    await renderTemplate(
      `<mui-swipe-action [actions]="actions"><span>Row</span></mui-swipe-action>`,
      { imports: [SwipeAction], componentProperties: { actions: rightActions } },
    );
    // a11y buttons (visually hidden) exist
    expect(screen.getAllByRole('button', { name: 'Delete' })).toBeTruthy();
    expect(screen.getAllByRole('button', { name: 'Archive' })).toBeTruthy();
  });

  it('emits actionTriggered when accessible button clicked', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    await renderTemplate(
      `<mui-swipe-action [actions]="actions" (actionTriggered)="handler($event)"><span>Row</span></mui-swipe-action>`,
      { imports: [SwipeAction], componentProperties: { actions: rightActions, handler } },
    );
    // Click the a11y Delete button (visible in DOM even if visually hidden)
    const deleteBtns = screen.getAllByRole('button', { name: 'Delete' });
    // The last one is the a11y button
    await user.click(deleteBtns[deleteBtns.length - 1]);
    expect(handler).toHaveBeenCalledWith('delete');
  });

  it('emits correct key for each action', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    await renderTemplate(
      `<mui-swipe-action [actions]="actions" (actionTriggered)="handler($event)"><span>Row</span></mui-swipe-action>`,
      { imports: [SwipeAction], componentProperties: { actions: rightActions, handler } },
    );
    const archiveBtns = screen.getAllByRole('button', { name: 'Archive' });
    await user.click(archiveBtns[archiveBtns.length - 1]);
    expect(handler).toHaveBeenCalledWith('archive');
  });

  it('renders no action rails when actions is empty', async () => {
    await renderTemplate(`<mui-swipe-action [actions]="[]"><span>Row</span></mui-swipe-action>`, {
      imports: [SwipeAction],
    });
    expect(document.querySelector('.mui-swipe-action__rail')).not.toBeInTheDocument();
  });

  it('renders right rail when right actions provided', async () => {
    await renderTemplate(
      `<mui-swipe-action [actions]="actions"><span>Row</span></mui-swipe-action>`,
      { imports: [SwipeAction], componentProperties: { actions: rightActions } },
    );
    expect(document.querySelector('.mui-swipe-action__rail--right')).toBeInTheDocument();
    expect(document.querySelector('.mui-swipe-action__rail--left')).not.toBeInTheDocument();
  });

  it('renders left rail when left actions provided', async () => {
    await renderTemplate(
      `<mui-swipe-action [actions]="actions"><span>Row</span></mui-swipe-action>`,
      { imports: [SwipeAction], componentProperties: { actions: leftActions } },
    );
    expect(document.querySelector('.mui-swipe-action__rail--left')).toBeInTheDocument();
  });

  it('renders both rails when both sides have actions', async () => {
    const both = [...leftActions, ...rightActions];
    await renderTemplate(
      `<mui-swipe-action [actions]="actions"><span>Row</span></mui-swipe-action>`,
      { imports: [SwipeAction], componentProperties: { actions: both } },
    );
    expect(document.querySelector('.mui-swipe-action__rail--left')).toBeInTheDocument();
    expect(document.querySelector('.mui-swipe-action__rail--right')).toBeInTheDocument();
  });

  it('has a group landmark for accessible actions', async () => {
    await renderTemplate(
      `<mui-swipe-action [actions]="actions"><span>Row</span></mui-swipe-action>`,
      { imports: [SwipeAction], componentProperties: { actions: rightActions } },
    );
    expect(screen.getByRole('group', { name: 'Row actions' })).toBeInTheDocument();
  });

  it('applies correct color class to action buttons in rail', async () => {
    const mixedActions: SwipeActionItem[] = [
      { key: 'delete', label: 'Delete', side: 'right', color: 'danger' },
      { key: 'star', label: 'Star', side: 'left', color: 'warning' },
    ];
    await renderTemplate(
      `<mui-swipe-action [actions]="actions"><span>Row</span></mui-swipe-action>`,
      { imports: [SwipeAction], componentProperties: { actions: mixedActions } },
    );
    expect(document.querySelector('.mui-swipe-action__action--danger')).toBeInTheDocument();
    expect(document.querySelector('.mui-swipe-action__action--warning')).toBeInTheDocument();
  });

  it('applies primary color class when no color is specified', async () => {
    const uncolored: SwipeActionItem[] = [{ key: 'edit', label: 'Edit', side: 'right' }];
    await renderTemplate(
      `<mui-swipe-action [actions]="actions"><span>Row</span></mui-swipe-action>`,
      { imports: [SwipeAction], componentProperties: { actions: uncolored } },
    );
    expect(document.querySelector('.mui-swipe-action__action--primary')).toBeInTheDocument();
  });

  it('clicking More actions reveals right rail and sets data-revealed', async () => {
    await renderTemplate(
      `<mui-swipe-action [actions]="actions"><span>Row</span></mui-swipe-action>`,
      { imports: [SwipeAction], componentProperties: { actions: rightActions } },
    );
    const host = document.querySelector('mui-swipe-action')!;
    expect(host.getAttribute('data-revealed')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'More actions' }));
    expect(host.getAttribute('data-revealed')).toBe('right');
  });

  it('clicking More actions reveals left rail when only left actions exist', async () => {
    await renderTemplate(
      `<mui-swipe-action [actions]="actions"><span>Row</span></mui-swipe-action>`,
      { imports: [SwipeAction], componentProperties: { actions: leftActions } },
    );
    const host = document.querySelector('mui-swipe-action')!;
    fireEvent.click(screen.getByRole('button', { name: 'More actions' }));
    expect(host.getAttribute('data-revealed')).toBe('left');
  });

  it('clicking Close actions collapses revealed rail', async () => {
    await renderTemplate(
      `<mui-swipe-action [actions]="actions"><span>Row</span></mui-swipe-action>`,
      { imports: [SwipeAction], componentProperties: { actions: rightActions } },
    );
    const host = document.querySelector('mui-swipe-action')!;
    fireEvent.click(screen.getByRole('button', { name: 'More actions' }));
    expect(host.getAttribute('data-revealed')).toBe('right');
    fireEvent.click(screen.getByRole('button', { name: 'Close actions' }));
    expect(host.getAttribute('data-revealed')).toBeNull();
  });

  describe('pointer gestures (real DOM events)', () => {
    afterEach(() => vi.restoreAllMocks());

    /** jsdom has no layout engine: give rails a width so settle logic can snap. */
    const stubRailWidth = () =>
      vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(80);

    const host = () => document.querySelector('mui-swipe-action') as HTMLElement;
    const track = () => document.querySelector('.mui-swipe-action__track') as HTMLElement;

    async function mount(actions: SwipeActionItem[]) {
      stubRailWidth();
      return renderTemplate(
        `<mui-swipe-action [actions]="actions"><span>Row</span></mui-swipe-action>`,
        { imports: [SwipeAction], componentProperties: { actions } },
      );
    }

    function swipe(dx: number, init: PointerEventInit & { target?: EventTarget } = {}): void {
      const { pointerType, button } = init;
      fireEvent.pointerDown(host(), { clientX: 0, pointerId: 1, pointerType, button });
      fireEvent.pointerMove(document, { clientX: dx, pointerId: 1, pointerType });
      fireEvent.pointerUp(document, { clientX: dx, pointerId: 1, pointerType });
    }

    it('drag right beyond threshold reveals left rail', async () => {
      const { detectChanges } = await mount(leftActions);
      swipe(100); // 100 > REVEAL_THRESHOLD (72)
      detectChanges();
      expect(host().getAttribute('data-revealed')).toBe('left');
    });

    it('drag left beyond threshold reveals right rail', async () => {
      const { detectChanges } = await mount(rightActions);
      swipe(-100);
      detectChanges();
      expect(host().getAttribute('data-revealed')).toBe('right');
    });

    it('drag below threshold settles back to closed', async () => {
      const { detectChanges } = await mount(leftActions);
      swipe(40);
      detectChanges();
      expect(host().getAttribute('data-revealed')).toBeNull();
    });

    it('H-C-efb780: a mouse drag reveals the rail (not touch-only)', async () => {
      const { detectChanges } = await mount(rightActions);
      swipe(-100, { pointerType: 'mouse', button: 0 });
      detectChanges();
      expect(host().getAttribute('data-revealed')).toBe('right');
    });

    it('H-C-efb780: a pen drag reveals the rail', async () => {
      const { detectChanges } = await mount(rightActions);
      swipe(-100, { pointerType: 'pen' });
      detectChanges();
      expect(host().getAttribute('data-revealed')).toBe('right');
    });

    it('H-C-efb780: a non-primary mouse button does not start a swipe', async () => {
      const { detectChanges } = await mount(rightActions);
      swipe(-100, { pointerType: 'mouse', button: 2 });
      detectChanges();
      expect(host().getAttribute('data-revealed')).toBeNull();
    });

    it('H-C-efb780: pointercancel restores the pre-drag position and ends the drag', async () => {
      const { detectChanges } = await mount(rightActions);
      fireEvent.pointerDown(host(), { clientX: 0, pointerId: 1 });
      fireEvent.pointerMove(document, { clientX: -60, pointerId: 1 });
      detectChanges();
      expect(track().style.transform).toBe('translateX(-60px)');
      fireEvent.pointerCancel(host(), { pointerId: 1 });
      detectChanges();
      expect(track().style.transform).toBe('translateX(0px)');
      // The drag is over: later moves/ups must not move or reveal anything.
      fireEvent.pointerMove(document, { clientX: -200, pointerId: 1 });
      fireEvent.pointerUp(document, { clientX: -200, pointerId: 1 });
      detectChanges();
      expect(host().getAttribute('data-revealed')).toBeNull();
      expect(track().style.transform).toBe('translateX(0px)');
    });

    it('H-C-efb780: events from a different pointer are ignored mid-drag', async () => {
      const { detectChanges } = await mount(rightActions);
      fireEvent.pointerDown(host(), { clientX: 0, pointerId: 1 });
      fireEvent.pointerMove(document, { clientX: -100, pointerId: 2 });
      fireEvent.pointerUp(document, { clientX: -100, pointerId: 2 });
      detectChanges();
      expect(host().getAttribute('data-revealed')).toBeNull();
      expect(track().style.transform).toBe('translateX(0px)');
    });

    it('H-C-efb780: destroying mid-drag removes the document listeners', async () => {
      const { fixture, detectChanges } = await mount(rightActions);
      const removeSpy = vi.spyOn(document, 'removeEventListener');
      fireEvent.pointerDown(host(), { clientX: 0, pointerId: 1 });
      fixture.destroy();
      expect(removeSpy).toHaveBeenCalledWith('pointermove', expect.any(Function));
      expect(removeSpy).toHaveBeenCalledWith('pointerup', expect.any(Function));
      detectChanges();
    });

    it('H-P-e49724: no touch listeners remain; legacy touch events do nothing', async () => {
      const { detectChanges } = await mount(rightActions);
      fireEvent.touchStart(host(), { touches: [{ clientX: 0 }] });
      fireEvent.touchMove(host(), { touches: [{ clientX: -100 }] });
      fireEvent.touchEnd(host());
      detectChanges();
      expect(host().getAttribute('data-revealed')).toBeNull();
    });

    it('track has no transition during active drag', async () => {
      const { detectChanges } = await mount(leftActions);
      fireEvent.pointerDown(host(), { clientX: 0, pointerId: 1 });
      fireEvent.pointerMove(document, { clientX: 30, pointerId: 1 });
      detectChanges();
      expect(track().style.transition).toBe('none');
    });

    it('track has ease transition once drag ends', async () => {
      const { detectChanges } = await mount(leftActions);
      swipe(100);
      detectChanges();
      expect(track().style.transition).toBe('transform 220ms ease');
    });
  });

  it('H-A11Y-730: the row host is the listitem', async () => {
    await renderTemplate('<mui-swipe-action [actions]="actions" />', {
      imports: [SwipeAction],
      componentProperties: { actions: [{ key: 'del', label: 'Delete', side: 'end' }] },
    });
    expect(document.querySelector('mui-swipe-action')).toHaveAttribute('role', 'listitem');
    expect(document.querySelector('.mui-swipe-action__track')).not.toHaveAttribute('role');
  });
});
