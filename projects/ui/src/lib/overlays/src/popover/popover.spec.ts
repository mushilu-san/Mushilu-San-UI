import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Popover } from './popover';
import { PopoverTrigger } from './popover-trigger';

const imports = [Popover, PopoverTrigger];

const basic = `
  <mui-popover>
    <button muiPopoverTrigger>Open</button>
    <p>Popover content</p>
  </mui-popover>
`;

describe('Popover', () => {
  it('panel is hidden by default', async () => {
    await renderTemplate(basic, { imports });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens panel on trigger click', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes panel on second trigger click', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('sets aria-expanded on trigger', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    const btn = screen.getByRole('button', { name: 'Open' });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    await user.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });

  it('sets aria-haspopup on trigger', async () => {
    await renderTemplate(basic, { imports });
    expect(screen.getByRole('button')).toHaveAttribute('aria-haspopup', 'dialog');
  });

  it('shows panel content when open', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it('renders heading when provided', async () => {
    const user = userEvent.setup();
    await renderTemplate(
      `<mui-popover heading="Settings"><button muiPopoverTrigger>Open</button><p>Content</p></mui-popover>`,
      { imports },
    );
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('emits opened and closed outputs', async () => {
    const user = userEvent.setup();
    const onOpened = vi.fn();
    const onClosed = vi.fn();
    await renderTemplate(
      `<mui-popover (opened)="onOpened()" (closed)="onClosed()">
        <button muiPopoverTrigger>Open</button>
        <p>Content</p>
       </mui-popover>`,
      { imports, componentProperties: { onOpened, onClosed } },
    );
    await user.click(screen.getByRole('button'));
    expect(onOpened).toHaveBeenCalledOnce();
    await user.click(screen.getByRole('button'));
    expect(onClosed).toHaveBeenCalledOnce();
  });

  it('applies data-placement to panel', async () => {
    const user = userEvent.setup();
    await renderTemplate(
      `<mui-popover placement="top-start"><button muiPopoverTrigger>Open</button><p>C</p></mui-popover>`,
      { imports },
    );
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog')).toHaveAttribute('data-placement', 'top-start');
  });

  it('opens when [open]="true" is set initially', async () => {
    await renderTemplate(
      `<mui-popover [open]="true"><button muiPopoverTrigger>Open</button><p>Content</p></mui-popover>`,
      { imports },
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes on outside click by default', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.click(document.body);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closeOnOutsideClick=false prevents outside click from closing', async () => {
    const user = userEvent.setup();
    await renderTemplate(
      `<mui-popover [closeOnOutsideClick]="false">
        <button muiPopoverTrigger>Open</button>
        <p>Content</p>
      </mui-popover>`,
      { imports },
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.click(document.body);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('clicking inside the popover does not close it', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closeOnEscape=false prevents Escape from closing', async () => {
    const user = userEvent.setup();
    await renderTemplate(
      `<mui-popover [closeOnEscape]="false">
        <button muiPopoverTrigger>Open</button>
        <p>Content</p>
      </mui-popover>`,
      { imports },
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.keyboard('{Escape}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('Escape when popover is closed is a no-op', async () => {
    const onClosed = vi.fn();
    await renderTemplate(
      `<mui-popover (closed)="onClosed()">
        <button muiPopoverTrigger>Open</button>
        <p>Content</p>
      </mui-popover>`,
      { imports, componentProperties: { onClosed } },
    );
    // Popover starts closed — Escape should not emit closed
    const user = userEvent.setup();
    await user.keyboard('{Escape}');
    expect(onClosed).not.toHaveBeenCalled();
  });

  it('H-A-d23477: panel does not claim aria-modal (it does not trap focus)', async () => {
    const user = userEvent.setup();
    await renderTemplate(basic, { imports });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-modal');
  });

  describe('positioning', () => {
    afterEach(() => vi.restoreAllMocks());

    it('H-C-c098c2: clamps into the viewport and repositions on scroll + resize while open', async () => {
      const user = userEvent.setup();
      const anchor = { left: 980, top: 740, width: 40, height: 20, right: 1020, bottom: 760 };
      const rectSpy = vi
        .spyOn(Element.prototype, 'getBoundingClientRect')
        .mockImplementation(() => anchor as DOMRect);
      vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(200);
      vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(100);
      await renderTemplate(basic, { imports });
      await user.click(screen.getByRole('button', { name: 'Open' }));
      const panel = screen.getByRole('dialog');
      // viewport 1024x768: left clamps to 1024-200-4 (820) => 820-980 local; top to 664 => -76 local
      expect(panel.style.left).toBe('-160px');
      expect(panel.style.top).toBe('-76px');

      // scroll: anchor moves up, panel no longer needs the vertical clamp
      Object.assign(anchor, { top: 200, bottom: 220 });
      window.dispatchEvent(new Event('scroll'));
      expect(panel.style.top).toBe('28px'); // 200+20+8 - 200

      // resize: narrower viewport changes the horizontal clamp
      const innerWidth = window.innerWidth;
      Object.defineProperty(window, 'innerWidth', { value: 600, configurable: true });
      window.dispatchEvent(new Event('resize'));
      expect(panel.style.left).toBe('-584px'); // (600-200-4) - 980
      Object.defineProperty(window, 'innerWidth', { value: innerWidth, configurable: true });

      // closing detaches the listeners
      await user.click(screen.getByRole('button', { name: 'Open' }));
      rectSpy.mockClear();
      window.dispatchEvent(new Event('scroll'));
      expect(rectSpy).not.toHaveBeenCalled();
    });
  });
});
