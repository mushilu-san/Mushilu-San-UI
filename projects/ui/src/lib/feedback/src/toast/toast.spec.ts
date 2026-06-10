import { TestBed } from '@angular/core/testing';
import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Toast } from './toast';
import { ToastContainer } from './toast-container';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  it('adds a toast and returns a ref with defaults', () => {
    const service = TestBed.inject(ToastService);
    const ref = service.show('Saved');
    expect(ref.variant).toBe('info');
    expect(ref.duration).toBe(5000);
    expect(service.toasts()).toHaveLength(1);
    service.clear();
  });

  it('exposes variant convenience methods', () => {
    const service = TestBed.inject(ToastService);
    expect(service.success('ok').variant).toBe('success');
    expect(service.warning('hmm').variant).toBe('warning');
    expect(service.danger('no').variant).toBe('danger');
    service.clear();
  });

  it('dismisses a toast by id', () => {
    const service = TestBed.inject(ToastService);
    const a = service.show('A');
    const b = service.show('B');
    service.dismiss(a.id);
    expect(service.toasts().map((t) => t.id)).toEqual([b.id]);
    service.clear();
  });

  it('clears all toasts', () => {
    const service = TestBed.inject(ToastService);
    service.show('A');
    service.show('B');
    service.clear();
    expect(service.toasts()).toHaveLength(0);
  });
});

describe('Toast', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders message and heading', async () => {
    await renderTemplate('<mui-toast heading="Done" message="File uploaded"></mui-toast>', {
      imports: [Toast],
    });
    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.getByText('File uploaded')).toBeInTheDocument();
  });

  it('has an accessible dismiss button', async () => {
    await renderTemplate('<mui-toast message="Hi"></mui-toast>', { imports: [Toast] });
    expect(screen.getByRole('button', { name: 'Dismiss notification' })).toBeInTheDocument();
  });

  it('emits dismissed when the dismiss button is clicked', async () => {
    const handler = vi.fn();
    await renderTemplate('<mui-toast message="Hi" duration="0" (dismissed)="h()"></mui-toast>', {
      imports: [Toast],
      componentProperties: { h: handler },
    });
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('emits dismissed on Escape', async () => {
    const handler = vi.fn();
    await renderTemplate('<mui-toast message="Hi" duration="0" (dismissed)="h()"></mui-toast>', {
      imports: [Toast],
      componentProperties: { h: handler },
    });
    fireEvent.keyDown(document.querySelector('mui-toast')!, { key: 'Escape' });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('auto-dismisses after the duration elapses', async () => {
    vi.useFakeTimers();
    const handler = vi.fn();
    await renderTemplate('<mui-toast message="Hi" duration="3000" (dismissed)="h()"></mui-toast>', {
      imports: [Toast],
      componentProperties: { h: handler },
    });
    expect(handler).not.toHaveBeenCalled();
    vi.advanceTimersByTime(3000);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('pauses the auto-dismiss timer on hover and resumes on leave', async () => {
    vi.useFakeTimers();
    const handler = vi.fn();
    await renderTemplate('<mui-toast message="Hi" duration="1000" (dismissed)="h()"></mui-toast>', {
      imports: [Toast],
      componentProperties: { h: handler },
    });
    const host = document.querySelector('mui-toast')!;

    vi.advanceTimersByTime(500);
    fireEvent.mouseEnter(host); // pause with 500ms remaining
    vi.advanceTimersByTime(2000); // would have dismissed if not paused
    expect(handler).not.toHaveBeenCalled();

    fireEvent.mouseLeave(host); // resume
    vi.advanceTimersByTime(500);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not auto-dismiss when duration is 0', async () => {
    vi.useFakeTimers();
    const handler = vi.fn();
    await renderTemplate('<mui-toast message="Hi" duration="0" (dismissed)="h()"></mui-toast>', {
      imports: [Toast],
      componentProperties: { h: handler },
    });
    vi.advanceTimersByTime(10000);
    expect(handler).not.toHaveBeenCalled();
  });
});

describe('ToastContainer', () => {
  it('is a labelled notifications region', async () => {
    await renderTemplate('<mui-toast-container></mui-toast-container>', {
      imports: [ToastContainer],
    });
    const host = document.querySelector('mui-toast-container')!;
    expect(host).toHaveAttribute('role', 'region');
    expect(host).toHaveAttribute('aria-label', 'Notifications');
  });

  it('renders polite and assertive live regions', async () => {
    await renderTemplate('<mui-toast-container></mui-toast-container>', {
      imports: [ToastContainer],
    });
    expect(document.querySelector('[aria-live="polite"]')).toBeTruthy();
    expect(document.querySelector('[aria-live="assertive"]')).toBeTruthy();
  });

  it('renders one toast per service entry and removes on dismiss', async () => {
    const view = await renderTemplate('<mui-toast-container></mui-toast-container>', {
      imports: [ToastContainer],
    });
    const service = TestBed.inject(ToastService);

    service.show('First', { duration: 0 });
    service.show('Second', { duration: 0, variant: 'danger' });
    view.detectChanges();
    expect(document.querySelectorAll('mui-toast')).toHaveLength(2);

    const [first] = service.toasts();
    service.dismiss(first.id);
    view.detectChanges();
    expect(document.querySelectorAll('mui-toast')).toHaveLength(1);

    service.clear();
  });
});
