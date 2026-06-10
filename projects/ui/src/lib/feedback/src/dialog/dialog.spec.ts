import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Dialog } from './dialog';

const panel = () => document.querySelector('dialog') as HTMLDialogElement;

describe('Dialog', () => {
  it('is closed by default', async () => {
    await renderTemplate('<mui-dialog>Body</mui-dialog>', { imports: [Dialog] });
    expect(panel().hasAttribute('open')).toBe(false);
  });

  it('opens when [open] is true and emits opened', async () => {
    const opened = vi.fn();
    await renderTemplate('<mui-dialog [open]="true" (opened)="o()">Body</mui-dialog>', {
      imports: [Dialog],
      componentProperties: { o: opened },
    });
    expect(panel().hasAttribute('open')).toBe(true);
    expect(opened).toHaveBeenCalledTimes(1);
  });

  it('wires aria-labelledby to the heading', async () => {
    await renderTemplate('<mui-dialog [open]="true" heading="Confirm">Body</mui-dialog>', {
      imports: [Dialog],
    });
    const labelledby = panel().getAttribute('aria-labelledby');
    expect(labelledby).toBeTruthy();
    expect(document.getElementById(labelledby!)?.textContent).toBe('Confirm');
  });

  it('omits aria-labelledby when there is no heading', async () => {
    await renderTemplate('<mui-dialog [open]="true">Body</mui-dialog>', { imports: [Dialog] });
    expect(panel().hasAttribute('aria-labelledby')).toBe(false);
  });

  it('has an accessible close button', async () => {
    await renderTemplate('<mui-dialog [open]="true">Body</mui-dialog>', { imports: [Dialog] });
    expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
  });

  it('closes and emits closed when the close button is clicked', async () => {
    const closed = vi.fn();
    await renderTemplate('<mui-dialog [open]="true" (closed)="c()">Body</mui-dialog>', {
      imports: [Dialog],
      componentProperties: { c: closed },
    });
    await userEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(panel().hasAttribute('open')).toBe(false);
    expect(closed).toHaveBeenCalledTimes(1);
  });

  it('closes when the backdrop (dialog element) is clicked', async () => {
    await renderTemplate('<mui-dialog [open]="true">Body</mui-dialog>', { imports: [Dialog] });
    fireEvent.click(panel());
    expect(panel().hasAttribute('open')).toBe(false);
  });

  it('does not close on backdrop click when closeOnBackdrop is false', async () => {
    await renderTemplate('<mui-dialog [open]="true" [closeOnBackdrop]="false">Body</mui-dialog>', {
      imports: [Dialog],
    });
    fireEvent.click(panel());
    expect(panel().hasAttribute('open')).toBe(true);
  });

  it('does not close when content inside the panel is clicked', async () => {
    await renderTemplate('<mui-dialog [open]="true"><p>Inner</p></mui-dialog>', { imports: [Dialog] });
    fireEvent.click(screen.getByText('Inner'));
    expect(panel().hasAttribute('open')).toBe(true);
  });

  it('prevents Escape close when closeOnEscape is false', async () => {
    await renderTemplate('<mui-dialog [open]="true" [closeOnEscape]="false">Body</mui-dialog>', {
      imports: [Dialog],
    });
    const event = new Event('cancel', { cancelable: true });
    panel().dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('reflects size on the panel', async () => {
    await renderTemplate('<mui-dialog [open]="true" size="lg">Body</mui-dialog>', { imports: [Dialog] });
    expect(panel()).toHaveAttribute('data-size', 'lg');
  });
});
