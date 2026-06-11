import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderComponent, renderTemplate } from '../../../../core/testing';
import { Sheet } from './sheet';

describe('Sheet', () => {
  it('is not visible when closed', async () => {
    await renderComponent(Sheet, { inputs: { open: false } });
    expect(document.querySelector('dialog')).not.toHaveAttribute('open');
  });

  it('is visible when open', async () => {
    await renderComponent(Sheet, { inputs: { open: true } });
    expect(document.querySelector('dialog')).toHaveAttribute('open');
  });

  it('renders heading when provided', async () => {
    await renderComponent(Sheet, { inputs: { open: true, heading: 'Settings' } });
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
  });

  it('does not render heading element when heading not provided', async () => {
    await renderComponent(Sheet, { inputs: { open: true } });
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('wires aria-labelledby to heading id when heading is set', async () => {
    await renderComponent(Sheet, { inputs: { open: true, heading: 'My Sheet' } });
    const dialog = document.querySelector('dialog')!;
    const headingId = screen.getByRole('heading').getAttribute('id')!;
    expect(dialog).toHaveAttribute('aria-labelledby', headingId);
  });

  it('renders close button by default', async () => {
    await renderComponent(Sheet, { inputs: { open: true } });
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('hides close button when showClose is false', async () => {
    await renderComponent(Sheet, { inputs: { open: true, showClose: false } });
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('closes on close button click', async () => {
    const user = userEvent.setup();
    const onClosed = vi.fn();
    await renderTemplate(
      `<mui-sheet [(open)]="open" (closed)="onClosed()">Content</mui-sheet>`,
      { imports: [Sheet], componentProperties: { open: true, onClosed } },
    );
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(document.querySelector('dialog')).not.toHaveAttribute('open');
    expect(onClosed).toHaveBeenCalledOnce();
  });

  it('emits opened event when opened', async () => {
    const onOpened = vi.fn();
    await renderTemplate(
      `<mui-sheet [(open)]="open" (opened)="onOpened()">Content</mui-sheet>`,
      { imports: [Sheet], componentProperties: { open: true, onOpened } },
    );
    expect(onOpened).toHaveBeenCalledOnce();
  });

  it('projects body content', async () => {
    await renderTemplate(
      `<mui-sheet [open]="true"><p>Sheet body</p></mui-sheet>`,
      { imports: [Sheet] },
    );
    expect(screen.getByText('Sheet body')).toBeInTheDocument();
  });

  it('sets data-side attribute', async () => {
    await renderComponent(Sheet, { inputs: { open: true, side: 'left' } });
    expect(document.querySelector('dialog')).toHaveAttribute('data-side', 'left');
  });

  it('sets data-size attribute', async () => {
    await renderComponent(Sheet, { inputs: { open: true, size: 'lg' } });
    expect(document.querySelector('dialog')).toHaveAttribute('data-size', 'lg');
  });
});
