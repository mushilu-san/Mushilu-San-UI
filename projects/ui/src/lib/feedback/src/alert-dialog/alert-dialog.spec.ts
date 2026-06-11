import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderComponent, renderTemplate } from '../../../../core/testing';
import { AlertDialog } from './alert-dialog';

describe('AlertDialog', () => {
  it('is not visible when closed', async () => {
    await renderComponent(AlertDialog, { inputs: { open: false, heading: 'Delete?' } });
    expect(document.querySelector('dialog')).not.toHaveAttribute('open');
  });

  it('is visible when open', async () => {
    await renderComponent(AlertDialog, { inputs: { open: true, heading: 'Delete?' } });
    expect(document.querySelector('dialog')).toHaveAttribute('open');
  });

  it('renders heading', async () => {
    await renderComponent(AlertDialog, { inputs: { open: true, heading: 'Delete item?' } });
    expect(screen.getByRole('heading', { name: 'Delete item?' })).toBeInTheDocument();
  });

  it('renders confirm and cancel buttons', async () => {
    await renderComponent(AlertDialog, {
      inputs: { open: true, heading: 'Delete?', confirmLabel: 'Delete', cancelLabel: 'Keep' },
    });
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument();
  });

  it('emits confirmed on confirm click', async () => {
    const user = userEvent.setup();
    const onConfirmed = vi.fn();
    await renderTemplate(
      `<mui-alert-dialog [open]="true" heading="Delete?" (confirmed)="onConfirmed()">Are you sure?</mui-alert-dialog>`,
      { imports: [AlertDialog], componentProperties: { onConfirmed } },
    );
    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onConfirmed).toHaveBeenCalledOnce();
  });

  it('emits cancelled on cancel click', async () => {
    const user = userEvent.setup();
    const onCancelled = vi.fn();
    await renderTemplate(
      `<mui-alert-dialog [open]="true" heading="Delete?" (cancelled)="onCancelled()">Are you sure?</mui-alert-dialog>`,
      { imports: [AlertDialog], componentProperties: { onCancelled } },
    );
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancelled).toHaveBeenCalledOnce();
  });

  it('closes after confirming', async () => {
    const user = userEvent.setup();
    await renderTemplate(
      `<mui-alert-dialog [(open)]="open" heading="Delete?">Are you sure?</mui-alert-dialog>`,
      { imports: [AlertDialog], componentProperties: { open: true } },
    );
    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(document.querySelector('dialog')).not.toHaveAttribute('open');
  });

  it('wires aria-labelledby to title id', async () => {
    await renderComponent(AlertDialog, { inputs: { open: true, heading: 'Are you sure?' } });
    const dialog = document.querySelector('dialog')!;
    const headingId = screen.getByRole('heading').getAttribute('id')!;
    expect(dialog).toHaveAttribute('aria-labelledby', headingId);
  });

  it('projects body content', async () => {
    await renderTemplate(
      `<mui-alert-dialog [open]="true" heading="Confirm"><span>This is irreversible.</span></mui-alert-dialog>`,
      { imports: [AlertDialog] },
    );
    expect(screen.getByText('This is irreversible.')).toBeInTheDocument();
  });

  it('applies destructive class on confirm button when destructive=true', async () => {
    await renderComponent(AlertDialog, {
      inputs: { open: true, heading: 'Delete?', destructive: true },
    });
    expect(screen.getByRole('button', { name: 'Confirm' }))
      .toHaveClass('mui-alert-dialog__btn--destructive');
  });
});
