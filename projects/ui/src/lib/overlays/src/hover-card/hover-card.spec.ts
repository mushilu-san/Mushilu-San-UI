import { fireEvent, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { HoverCard } from './hover-card';
import { HoverCardContent } from './hover-card-content';
import { HoverCardTrigger } from './hover-card-trigger';

const IMPORTS = [HoverCard, HoverCardTrigger, HoverCardContent];

const BASE = `
  <mui-hover-card [openDelay]="0" [closeDelay]="0">
    <a muiHoverCardTrigger href="#" data-testid="trigger">Hover me</a>
    <mui-hover-card-content><p>Card content</p></mui-hover-card-content>
  </mui-hover-card>
`;

describe('HoverCard', () => {
  it('panel is hidden by default', async () => {
    await renderTemplate(BASE, { imports: IMPORTS });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows panel on mouseenter', async () => {
    const user = userEvent.setup();
    await renderTemplate(BASE, { imports: IMPORTS });
    await user.hover(screen.getByTestId('trigger'));
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
  });

  it('hides panel on mouseleave', async () => {
    const user = userEvent.setup();
    await renderTemplate(BASE, { imports: IMPORTS });
    await user.hover(screen.getByTestId('trigger'));
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
    await user.unhover(screen.getByTestId('trigger'));
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('shows panel on focus', async () => {
    await renderTemplate(BASE, { imports: IMPORTS });
    screen.getByTestId('trigger').focus();
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
  });

  it('hides panel on blur', async () => {
    await renderTemplate(BASE, { imports: IMPORTS });
    screen.getByTestId('trigger').focus();
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
    screen.getByTestId('trigger').blur();
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('projects content into panel', async () => {
    const user = userEvent.setup();
    await renderTemplate(BASE, { imports: IMPORTS });
    await user.hover(screen.getByTestId('trigger'));
    await waitFor(() => expect(screen.getByText('Card content')).toBeInTheDocument());
  });

  it('emits opened event when card opens', async () => {
    const user = userEvent.setup();
    const onOpened = vi.fn();
    await renderTemplate(
      `<mui-hover-card [openDelay]="0" (opened)="onOpened()">
        <a muiHoverCardTrigger href="#" data-testid="t">Hover</a>
        <mui-hover-card-content>Content</mui-hover-card-content>
      </mui-hover-card>`,
      { imports: IMPORTS, componentProperties: { onOpened } },
    );
    await user.hover(screen.getByTestId('t'));
    await waitFor(() => expect(onOpened).toHaveBeenCalledOnce());
  });

  it('emits closed event when card closes', async () => {
    const user = userEvent.setup();
    const onClosed = vi.fn();
    await renderTemplate(
      `<mui-hover-card [openDelay]="0" [closeDelay]="0" (closed)="onClosed()">
        <a muiHoverCardTrigger href="#" data-testid="t">Hover</a>
        <mui-hover-card-content>Content</mui-hover-card-content>
      </mui-hover-card>`,
      { imports: IMPORTS, componentProperties: { onClosed } },
    );
    await user.hover(screen.getByTestId('t'));
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
    await user.unhover(screen.getByTestId('t'));
    await waitFor(() => expect(onClosed).toHaveBeenCalledOnce());
  });
});

const DEFAULT_DELAY_BASE = `
  <mui-hover-card>
    <a muiHoverCardTrigger href="#" data-testid="t">Hover me</a>
    <mui-hover-card-content><p>Card content</p></mui-hover-card-content>
  </mui-hover-card>
`;

describe('HoverCard (fake timers)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('H-U-439cab: does not open before the default 700ms openDelay elapses', async () => {
    const { detectChanges } = await renderTemplate(DEFAULT_DELAY_BASE, { imports: IMPORTS });
    fireEvent.mouseEnter(screen.getByTestId('t'));
    vi.advanceTimersByTime(699);
    detectChanges();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('H-U-439cab: opens once the default 700ms openDelay elapses', async () => {
    const { detectChanges } = await renderTemplate(DEFAULT_DELAY_BASE, { imports: IMPORTS });
    fireEvent.mouseEnter(screen.getByTestId('t'));
    vi.advanceTimersByTime(700);
    detectChanges();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('H-U-439cab: mouseleave before openDelay elapses cancels the pending open', async () => {
    const { detectChanges } = await renderTemplate(DEFAULT_DELAY_BASE, { imports: IMPORTS });
    const trigger = screen.getByTestId('t');
    fireEvent.mouseEnter(trigger);
    vi.advanceTimersByTime(300);
    fireEvent.mouseLeave(trigger);
    vi.advanceTimersByTime(700);
    detectChanges();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('H-U-439cab: re-entering during the 300ms closeDelay cancels the pending close', async () => {
    const { detectChanges } = await renderTemplate(DEFAULT_DELAY_BASE, { imports: IMPORTS });
    const trigger = screen.getByTestId('t');
    fireEvent.mouseEnter(trigger);
    vi.advanceTimersByTime(700);
    detectChanges();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    fireEvent.mouseLeave(trigger);
    vi.advanceTimersByTime(150);
    fireEvent.mouseEnter(trigger);
    vi.advanceTimersByTime(300);
    detectChanges();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('H-U-439cab: clears pending timers on destroy without throwing', async () => {
    const { detectChanges, fixture } = await renderTemplate(DEFAULT_DELAY_BASE, {
      imports: IMPORTS,
    });
    fireEvent.mouseEnter(screen.getByTestId('t'));
    detectChanges();
    expect(() => fixture.destroy()).not.toThrow();
  });
});

describe('HoverCard dismiss and positioning', () => {
  it('H-E-19e98b: Escape dismisses an open card, keeping focus on the trigger', async () => {
    const onClosed = vi.fn();
    await renderTemplate(
      `<mui-hover-card [openDelay]="0" [closeDelay]="0" (closed)="onClosed()">
        <a muiHoverCardTrigger href="#" data-testid="trigger">Hover me</a>
        <mui-hover-card-content><p>Card content</p></mui-hover-card-content>
      </mui-hover-card>`,
      { imports: IMPORTS, componentProperties: { onClosed } },
    );
    const trigger = screen.getByTestId('trigger');
    trigger.focus();
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
    expect(onClosed).toHaveBeenCalledOnce();
    expect(document.activeElement).toBe(trigger);
  });

  it('H-E-19e98b: Escape while closed is a no-op', async () => {
    const onClosed = vi.fn();
    await renderTemplate(
      `<mui-hover-card (closed)="onClosed()">
        <a muiHoverCardTrigger href="#">Hover me</a>
        <mui-hover-card-content><p>Card content</p></mui-hover-card-content>
      </mui-hover-card>`,
      { imports: IMPORTS, componentProperties: { onClosed } },
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClosed).not.toHaveBeenCalled();
  });

  describe('positioning', () => {
    afterEach(() => vi.restoreAllMocks());

    it('H-C-57b708: clamps into the viewport and repositions on scroll while open', async () => {
      const user = userEvent.setup();
      const anchor = { left: 980, top: 740, width: 40, height: 20, right: 1020, bottom: 760 };
      vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(
        () => anchor as DOMRect,
      );
      vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(200);
      vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(100);
      await renderTemplate(BASE, { imports: IMPORTS });
      await user.hover(screen.getByTestId('trigger'));
      const panel = await waitFor(() => screen.getByRole('tooltip'));
      // viewport 1024x768: left clamps to 820 (=> -160 local), top to 664 (=> -76 local)
      expect(panel.style.left).toBe('-160px');
      expect(panel.style.top).toBe('-76px');

      Object.assign(anchor, { top: 200, bottom: 220 });
      window.dispatchEvent(new Event('scroll'));
      expect(panel.style.top).toBe('28px'); // 220 + 8 - 200
    });
  });
});
