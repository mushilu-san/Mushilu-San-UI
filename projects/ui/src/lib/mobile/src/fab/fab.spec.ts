import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderComponent, renderTemplate } from '../../../../core/testing';
import { Fab } from './fab';

describe('Fab', () => {
  it('renders a button with the required label', async () => {
    await renderComponent(Fab, { inputs: { label: 'Add item' } });
    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument();
  });

  it('applies default variant primary', async () => {
    const { container } = await renderComponent(Fab, { inputs: { label: 'Add' } });
    expect(container).toHaveAttribute('data-variant', 'primary');
  });

  it('reflects size attribute on host', async () => {
    const { container } = await renderComponent(Fab, { inputs: { label: 'Add', size: 'sm' } });
    expect(container).toHaveAttribute('data-size', 'sm');
  });

  it('emits clicked on user click when enabled', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    await renderTemplate(
      `<mui-fab label="Add" (clicked)="handler($event)"></mui-fab>`,
      { imports: [Fab], componentProperties: { handler } },
    );
    await user.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('does not emit clicked when disabled', async () => {
    const handler = vi.fn();
    await renderTemplate(
      `<mui-fab label="Add" disabled (clicked)="handler($event)"></mui-fab>`,
      { imports: [Fab], componentProperties: { handler } },
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('does not emit clicked when loading', async () => {
    const handler = vi.fn();
    await renderTemplate(
      `<mui-fab label="Add" [loading]="true" (clicked)="handler($event)"></mui-fab>`,
      { imports: [Fab], componentProperties: { handler } },
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('sets aria-disabled when disabled', async () => {
    await renderComponent(Fab, { inputs: { label: 'Add', disabled: true } });
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });

  it('sets aria-busy when loading', async () => {
    await renderComponent(Fab, { inputs: { label: 'Add', loading: true } });
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('uses aria-label from label input when not extended', async () => {
    await renderComponent(Fab, { inputs: { label: 'Create post' } });
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Create post');
  });

  it('does not set aria-label when extended (label is visible text)', async () => {
    await renderComponent(Fab, { inputs: { label: 'Compose', extended: true } });
    const btn = screen.getByRole('button', { name: 'Compose' });
    expect(btn).not.toHaveAttribute('aria-label');
    expect(btn).toHaveTextContent('Compose');
  });

  it('sets data-extended attribute when extended', async () => {
    const { container } = await renderComponent(Fab, { inputs: { label: 'Compose', extended: true } });
    expect(container).toHaveAttribute('data-extended');
  });

  it('is keyboard activatable via Enter', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    await renderTemplate(
      `<mui-fab label="Add" (clicked)="handler($event)"></mui-fab>`,
      { imports: [Fab], componentProperties: { handler } },
    );
    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');
    expect(handler).toHaveBeenCalledOnce();
  });

  it('is keyboard activatable via Space', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    await renderTemplate(
      `<mui-fab label="Add" (clicked)="handler($event)"></mui-fab>`,
      { imports: [Fab], componentProperties: { handler } },
    );
    screen.getByRole('button').focus();
    await user.keyboard(' ');
    expect(handler).toHaveBeenCalledOnce();
  });
});
