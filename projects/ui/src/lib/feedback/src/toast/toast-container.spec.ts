import { fireEvent, screen, within } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { ToastContainer } from './toast-container';
import { ToastService } from './toast.service';
import { TestBed } from '@angular/core/testing';

function setup() {
  return TestBed.inject(ToastService);
}

describe('ToastContainer (T-6)', () => {
  it('renders nothing when no toasts', async () => {
    await renderTemplate('<mui-toast-container />', { imports: [ToastContainer] });
    expect(document.querySelectorAll('mui-toast').length).toBe(0);
  });

  it('renders one mui-toast per service entry', async () => {
    await renderTemplate('<mui-toast-container />', { imports: [ToastContainer] });
    const svc = setup();
    svc.show('First');
    svc.show('Second');
    await new Promise((r) => setTimeout(r, 0));
    expect(document.querySelectorAll('mui-toast').length).toBe(2);
    svc.clear();
  });

  it('polite (info) toasts go into role=status region', async () => {
    await renderTemplate('<mui-toast-container />', { imports: [ToastContainer] });
    const svc = setup();
    svc.info('Hello');
    await new Promise((r) => setTimeout(r, 0));
    const politeRegion = document.querySelector('[role="status"]') as HTMLElement;
    expect(within(politeRegion).getByText('Hello')).toBeInTheDocument();
    svc.clear();
  });

  it('warning / danger toasts go into role=alert region', async () => {
    await renderTemplate('<mui-toast-container />', { imports: [ToastContainer] });
    const svc = setup();
    svc.warning('Watch out');
    svc.danger('Error!');
    await new Promise((r) => setTimeout(r, 0));
    const alertRegion = document.querySelector('[role="alert"]') as HTMLElement;
    expect(within(alertRegion).getByText('Watch out')).toBeInTheDocument();
    expect(within(alertRegion).getByText('Error!')).toBeInTheDocument();
    svc.clear();
  });

  it('success toast goes into polite region', async () => {
    await renderTemplate('<mui-toast-container />', { imports: [ToastContainer] });
    const svc = setup();
    svc.success('Done');
    await new Promise((r) => setTimeout(r, 0));
    const politeRegion = document.querySelector('[role="status"]') as HTMLElement;
    expect(within(politeRegion).getByText('Done')).toBeInTheDocument();
    svc.clear();
  });

  it('dismiss button calls service.dismiss(id)', async () => {
    await renderTemplate('<mui-toast-container />', { imports: [ToastContainer] });
    const svc = setup();
    svc.show('Dismissable', { duration: 0 });
    await new Promise((r) => setTimeout(r, 0));
    const dismissBtn = screen.getByRole('button', { name: /dismiss/i });
    fireEvent.click(dismissBtn);
    await new Promise((r) => setTimeout(r, 0));
    expect(document.querySelectorAll('mui-toast').length).toBe(0);
  });

  it('has role=region and default aria-label "Notifications"', async () => {
    await renderTemplate('<mui-toast-container />', { imports: [ToastContainer] });
    const container = document.querySelector('mui-toast-container') as HTMLElement;
    expect(container).toHaveAttribute('role', 'region');
    expect(container).toHaveAttribute('aria-label', 'Notifications');
  });

  it('accepts custom label input', async () => {
    await renderTemplate('<mui-toast-container label="Alerts" />', { imports: [ToastContainer] });
    expect(document.querySelector('mui-toast-container')).toHaveAttribute('aria-label', 'Alerts');
  });

  it('default placement is bottom-end', async () => {
    await renderTemplate('<mui-toast-container />', { imports: [ToastContainer] });
    expect(document.querySelector('mui-toast-container')).toHaveAttribute(
      'data-placement',
      'bottom-end',
    );
  });

  it('placement input sets data-placement', async () => {
    await renderTemplate('<mui-toast-container placement="top-center" />', {
      imports: [ToastContainer],
    });
    expect(document.querySelector('mui-toast-container')).toHaveAttribute(
      'data-placement',
      'top-center',
    );
  });
});
