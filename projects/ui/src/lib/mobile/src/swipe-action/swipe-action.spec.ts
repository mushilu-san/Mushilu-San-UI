import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderComponent, renderTemplate } from '../../../../core/testing';
import { SwipeAction } from './swipe-action';
import type { SwipeActionItem } from './swipe-action.types';

interface SwipePrivate {
  _railWidth: () => number;
  onTouchStart: (e: { touches: { clientX: number }[] }) => void;
  onTouchMove: (e: { touches: { clientX: number }[] }) => void;
  onTouchEnd: () => void;
}

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

  describe('touch gestures', () => {
    afterEach(() => vi.restoreAllMocks());

    it('drag right beyond threshold reveals left rail', async () => {
      const { fixture, detectChanges } = await renderComponent(SwipeAction, {
        inputs: { actions: leftActions },
      });
      const instance = fixture.componentInstance as unknown as SwipePrivate;
      // jsdom has no layout engine: stub _railWidth so settle logic can snap
      instance._railWidth = () => 80;

      instance.onTouchStart({ touches: [{ clientX: 0 }] });
      instance.onTouchMove({ touches: [{ clientX: 100 }] }); // 100 > REVEAL_THRESHOLD (72)
      instance.onTouchEnd();
      detectChanges();

      expect(fixture.nativeElement.getAttribute('data-revealed')).toBe('left');
    });

    it('drag left beyond threshold reveals right rail', async () => {
      const { fixture, detectChanges } = await renderComponent(SwipeAction, {
        inputs: { actions: rightActions },
      });
      const instance = fixture.componentInstance as unknown as SwipePrivate;
      instance._railWidth = () => 80;

      instance.onTouchStart({ touches: [{ clientX: 0 }] });
      instance.onTouchMove({ touches: [{ clientX: -100 }] }); // -100 < -72
      instance.onTouchEnd();
      detectChanges();

      expect(fixture.nativeElement.getAttribute('data-revealed')).toBe('right');
    });

    it('drag below threshold settles back to closed', async () => {
      const { fixture, detectChanges } = await renderComponent(SwipeAction, {
        inputs: { actions: leftActions },
      });
      const instance = fixture.componentInstance as unknown as SwipePrivate;
      instance._railWidth = () => 80;

      instance.onTouchStart({ touches: [{ clientX: 0 }] });
      instance.onTouchMove({ touches: [{ clientX: 40 }] }); // 40 < 72
      instance.onTouchEnd();
      detectChanges();

      expect(fixture.nativeElement.getAttribute('data-revealed')).toBeNull();
    });

    it('onTouchMove is a no-op when not dragging', async () => {
      const { fixture, detectChanges } = await renderComponent(SwipeAction, {
        inputs: { actions: rightActions },
      });
      const instance = fixture.componentInstance as unknown as SwipePrivate;

      // No touchstart, so _dragging is false
      instance.onTouchMove({ touches: [{ clientX: 200 }] });
      detectChanges();

      expect(fixture.nativeElement.getAttribute('data-revealed')).toBeNull();
    });

    it('track has no transition during active drag', async () => {
      const { fixture, detectChanges } = await renderComponent(SwipeAction, {
        inputs: { actions: leftActions },
      });
      const instance = fixture.componentInstance as unknown as SwipePrivate;
      instance._railWidth = () => 80;

      instance.onTouchStart({ touches: [{ clientX: 0 }] });
      instance.onTouchMove({ touches: [{ clientX: 30 }] });
      detectChanges();

      const track = fixture.nativeElement.querySelector('.mui-swipe-action__track') as HTMLElement;
      expect(track.style.transition).toBe('none');
    });

    it('track has ease transition once drag ends', async () => {
      const { fixture, detectChanges } = await renderComponent(SwipeAction, {
        inputs: { actions: leftActions },
      });
      const instance = fixture.componentInstance as unknown as SwipePrivate;
      instance._railWidth = () => 80;

      instance.onTouchStart({ touches: [{ clientX: 0 }] });
      instance.onTouchMove({ touches: [{ clientX: 100 }] });
      instance.onTouchEnd();
      detectChanges();

      const track = fixture.nativeElement.querySelector('.mui-swipe-action__track') as HTMLElement;
      expect(track.style.transition).toBe('transform 220ms ease');
    });
  });
});
