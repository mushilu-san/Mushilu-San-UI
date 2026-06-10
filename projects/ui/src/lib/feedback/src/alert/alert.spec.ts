import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Alert } from './alert';

describe('Alert', () => {
  it('defaults to info with role="status" and polite live region', async () => {
    await renderTemplate('<mui-alert>Body</mui-alert>', { imports: [Alert] });
    const host = document.querySelector('mui-alert')!;
    expect(host).toHaveAttribute('role', 'status');
    expect(host).toHaveAttribute('aria-live', 'polite');
    expect(host).toHaveAttribute('data-variant', 'info');
  });

  it('uses role="alert" and assertive live region for danger', async () => {
    await renderTemplate('<mui-alert variant="danger">Boom</mui-alert>', { imports: [Alert] });
    const host = document.querySelector('mui-alert')!;
    expect(host).toHaveAttribute('role', 'alert');
    expect(host).toHaveAttribute('aria-live', 'assertive');
  });

  it('uses role="alert" for warning', async () => {
    await renderTemplate('<mui-alert variant="warning">Careful</mui-alert>', { imports: [Alert] });
    expect(document.querySelector('mui-alert')).toHaveAttribute('role', 'alert');
  });

  it('uses role="status" for success', async () => {
    await renderTemplate('<mui-alert variant="success">Saved</mui-alert>', { imports: [Alert] });
    expect(document.querySelector('mui-alert')).toHaveAttribute('role', 'status');
  });

  it('renders the heading when provided', async () => {
    await renderTemplate('<mui-alert heading="Update available">Body</mui-alert>', {
      imports: [Alert],
    });
    expect(screen.getByText('Update available')).toBeInTheDocument();
  });

  it('projects body content', async () => {
    await renderTemplate('<mui-alert>Something happened</mui-alert>', { imports: [Alert] });
    expect(screen.getByText('Something happened')).toBeInTheDocument();
  });

  it('does not render a dismiss button by default', async () => {
    await renderTemplate('<mui-alert>Body</mui-alert>', { imports: [Alert] });
    expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument();
  });

  it('renders an accessible dismiss button when dismissible', async () => {
    await renderTemplate('<mui-alert dismissible>Body</mui-alert>', { imports: [Alert] });
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('emits dismissed when the dismiss button is clicked', async () => {
    const handler = vi.fn();
    await renderTemplate('<mui-alert dismissible (dismissed)="handler()">Body</mui-alert>', {
      imports: [Alert],
      componentProperties: { handler },
    });
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('emits dismissed on Escape when dismissible', async () => {
    const handler = vi.fn();
    await renderTemplate('<mui-alert dismissible (dismissed)="handler()">Body</mui-alert>', {
      imports: [Alert],
      componentProperties: { handler },
    });
    fireEvent.keyDown(document.querySelector('mui-alert')!, { key: 'Escape' });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('ignores Escape when not dismissible', async () => {
    const handler = vi.fn();
    await renderTemplate('<mui-alert (dismissed)="handler()">Body</mui-alert>', {
      imports: [Alert],
      componentProperties: { handler },
    });
    fireEvent.keyDown(document.querySelector('mui-alert')!, { key: 'Escape' });
    expect(handler).not.toHaveBeenCalled();
  });
});
