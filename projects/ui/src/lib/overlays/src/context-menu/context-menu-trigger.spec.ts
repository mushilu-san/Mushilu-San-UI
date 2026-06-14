import { fireEvent, screen, waitFor } from '@testing-library/angular';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { ContextMenu } from './context-menu';
import { ContextMenuTrigger } from './context-menu-trigger';
import { ContextMenuItem } from './context-menu-item';

const IMPORTS = [ContextMenu, ContextMenuTrigger, ContextMenuItem];

const BASE = `
  <mui-context-menu>
    <div muiContextMenuTrigger data-testid="trigger" style="width:200px;height:100px;">Trigger</div>
    <mui-context-menu-item>Action</mui-context-menu-item>
  </mui-context-menu>
`;

describe('ContextMenuTrigger', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('contextmenu event opens menu', async () => {
    await renderTemplate(BASE, { imports: IMPORTS });
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('long-press opens menu after 600ms', async () => {
    await renderTemplate(BASE, { imports: IMPORTS });
    const trigger = screen.getByTestId('trigger');

    fireEvent.touchStart(trigger, { touches: [{ clientX: 100, clientY: 50 }] });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    vi.advanceTimersByTime(600);
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());
  });

  it('touchmove cancels long-press timer', async () => {
    await renderTemplate(BASE, { imports: IMPORTS });
    const trigger = screen.getByTestId('trigger');

    fireEvent.touchStart(trigger, { touches: [{ clientX: 100, clientY: 50 }] });
    fireEvent.touchMove(trigger);
    vi.advanceTimersByTime(600);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('touchend cancels long-press timer', async () => {
    await renderTemplate(BASE, { imports: IMPORTS });
    const trigger = screen.getByTestId('trigger');

    fireEvent.touchStart(trigger, { touches: [{ clientX: 100, clientY: 50 }] });
    fireEvent.touchEnd(trigger);
    vi.advanceTimersByTime(600);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('empty touches on touchstart does not throw and does not open menu (B-2)', async () => {
    await renderTemplate(BASE, { imports: IMPORTS });
    const trigger = screen.getByTestId('trigger');

    expect(() => fireEvent.touchStart(trigger, { touches: [] })).not.toThrow();

    vi.advanceTimersByTime(600);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
