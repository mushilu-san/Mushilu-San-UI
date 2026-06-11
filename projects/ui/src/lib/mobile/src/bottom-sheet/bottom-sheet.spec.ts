import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderComponent, renderTemplate } from '../../../../core/testing';
import { BottomSheet } from './bottom-sheet';

describe('BottomSheet', () => {
  it('is not visible when closed', async () => {
    await renderComponent(BottomSheet, { inputs: { open: false, heading: 'Options' } });
    const dialog = document.querySelector('dialog');
    expect(dialog).not.toHaveAttribute('open');
  });

  it('is visible when open', async () => {
    await renderComponent(BottomSheet, { inputs: { open: true, heading: 'Options' } });
    const dialog = document.querySelector('dialog');
    expect(dialog).toHaveAttribute('open');
  });

  it('renders heading when provided', async () => {
    await renderComponent(BottomSheet, { inputs: { open: true, heading: 'Share' } });
    expect(screen.getByRole('heading', { name: 'Share' })).toBeInTheDocument();
  });

  it('does not render heading when omitted', async () => {
    await renderComponent(BottomSheet, { inputs: { open: true } });
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('wires aria-labelledby to heading id', async () => {
    await renderComponent(BottomSheet, { inputs: { open: true, heading: 'Options' } });
    const dialog = document.querySelector('dialog')!;
    const headingId = screen.getByRole('heading').getAttribute('id')!;
    expect(dialog).toHaveAttribute('aria-labelledby', headingId);
  });

  it('shows close button', async () => {
    await renderComponent(BottomSheet, { inputs: { open: true, heading: 'Options' } });
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('closes when close button is clicked', async () => {
    const user = userEvent.setup();
    await renderComponent(BottomSheet, { inputs: { open: true, heading: 'Options' } });
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(document.querySelector('dialog')).not.toHaveAttribute('open');
  });

  it('emits opened when open changes to true', async () => {
    const opened: void[] = [];
    await renderTemplate(
      `<mui-bottom-sheet [open]="isOpen" (opened)="onOpened()"></mui-bottom-sheet>`,
      {
        imports: [BottomSheet],
        componentProperties: {
          isOpen: true,
          onOpened: () => opened.push(),
        },
      },
    );
    expect(opened).toHaveLength(1);
  });

  it('renders handle by default', async () => {
    await renderComponent(BottomSheet, { inputs: { open: true } });
    expect(document.querySelector('.mui-bottom-sheet__handle')).toBeInTheDocument();
  });

  it('hides handle when showHandle is false', async () => {
    await renderComponent(BottomSheet, { inputs: { open: true, showHandle: false } });
    expect(document.querySelector('.mui-bottom-sheet__handle')).not.toBeInTheDocument();
  });

  it('projects body content', async () => {
    await renderTemplate(
      `<mui-bottom-sheet [open]="true"><p>Body text</p></mui-bottom-sheet>`,
      { imports: [BottomSheet] },
    );
    expect(screen.getByText('Body text')).toBeInTheDocument();
  });

  it('applies correct data-size attribute', async () => {
    await renderComponent(BottomSheet, { inputs: { open: true, size: 'lg' } });
    expect(document.querySelector('dialog')).toHaveAttribute('data-size', 'lg');
  });
});
