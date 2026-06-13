import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Button } from './button';

const imports = [Button];

describe('Button', () => {
  it('renders with default inputs', async () => {
    await renderTemplate('<button muiButton>Click me</button>', { imports });
    const btn = screen.getByRole('button', { name: 'Click me' });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('data-variant', 'primary');
    expect(btn).toHaveAttribute('data-size', 'md');
  });

  it('reflects variant input as host attribute', async () => {
    await renderTemplate('<button muiButton variant="secondary">Btn</button>', { imports });
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'secondary');
  });

  it('reflects size input as host attribute', async () => {
    await renderTemplate('<button muiButton size="lg">Btn</button>', { imports });
    expect(screen.getByRole('button')).toHaveAttribute('data-size', 'lg');
  });

  it('emits clicked output on user click when enabled', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    await renderTemplate(`<button muiButton (clicked)="handler($event)">Btn</button>`, {
      imports,
      componentProperties: { handler },
    });
    await user.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('does not emit clicked when disabled', async () => {
    const handler = vi.fn();
    await renderTemplate(`<button muiButton disabled (clicked)="handler($event)">Btn</button>`, {
      imports,
      componentProperties: { handler },
    });
    // pointer-events: none prevents real clicks; fireEvent bypasses CSS to test the guard
    fireEvent.click(screen.getByRole('button'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('does not emit clicked when loading', async () => {
    const handler = vi.fn();
    await renderTemplate(
      `<button muiButton [loading]="true" (clicked)="handler($event)">Btn</button>`,
      { imports, componentProperties: { handler } },
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('sets aria-disabled when disabled', async () => {
    await renderTemplate('<button muiButton disabled>Btn</button>', { imports });
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });

  it('sets aria-busy when loading', async () => {
    await renderTemplate('<button muiButton [loading]="true">Btn</button>', { imports });
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('is keyboard activatable via Enter', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    await renderTemplate(`<button muiButton (clicked)="handler($event)">Btn</button>`, {
      imports,
      componentProperties: { handler },
    });
    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');
    expect(handler).toHaveBeenCalledOnce();
  });

  it('is keyboard activatable via Space', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    await renderTemplate(`<button muiButton (clicked)="handler($event)">Btn</button>`, {
      imports,
      componentProperties: { handler },
    });
    screen.getByRole('button').focus();
    await user.keyboard(' ');
    expect(handler).toHaveBeenCalledOnce();
  });

  it('projects content into default slot', async () => {
    await renderTemplate('<button muiButton>Save changes</button>', { imports });
    expect(screen.getByText('Save changes')).toBeInTheDocument();
  });
});
