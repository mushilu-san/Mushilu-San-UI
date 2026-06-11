import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { SwipeAction } from './swipe-action';
import type { SwipeActionItem } from './swipe-action.types';

const rightActions: SwipeActionItem[] = [
  { key: 'delete', label: 'Delete', side: 'right', color: 'danger' },
  { key: 'archive', label: 'Archive', side: 'right', color: 'primary' },
];

const leftActions: SwipeActionItem[] = [
  { key: 'star', label: 'Star', side: 'left', color: 'warning' },
];

describe('SwipeAction', () => {
  it('renders row content', async () => {
    await renderTemplate(
      `<mui-swipe-action [actions]="actions"><span>Row text</span></mui-swipe-action>`,
      { imports: [SwipeAction], componentProperties: { actions: rightActions } },
    );
    expect(screen.getByText('Row text')).toBeInTheDocument();
  });

  it('renders accessible action buttons in the DOM', async () => {
    await renderTemplate(
      `<mui-swipe-action [actions]="actions"><span>Row</span></mui-swipe-action>`,
      { imports: [SwipeAction], componentProperties: { actions: rightActions } },
    );
    // a11y buttons (visually hidden) exist
    expect(screen.getAllByRole('button', { name: 'Delete' })).toBeTruthy();
    expect(screen.getAllByRole('button', { name: 'Archive' })).toBeTruthy();
  });

  it('emits actionTriggered when accessible button clicked', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    await renderTemplate(
      `<mui-swipe-action [actions]="actions" (actionTriggered)="handler($event)"><span>Row</span></mui-swipe-action>`,
      { imports: [SwipeAction], componentProperties: { actions: rightActions, handler } },
    );
    // Click the a11y Delete button (visible in DOM even if visually hidden)
    const deleteBtns = screen.getAllByRole('button', { name: 'Delete' });
    // The last one is the a11y button
    await user.click(deleteBtns[deleteBtns.length - 1]);
    expect(handler).toHaveBeenCalledWith('delete');
  });

  it('emits correct key for each action', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    await renderTemplate(
      `<mui-swipe-action [actions]="actions" (actionTriggered)="handler($event)"><span>Row</span></mui-swipe-action>`,
      { imports: [SwipeAction], componentProperties: { actions: rightActions, handler } },
    );
    const archiveBtns = screen.getAllByRole('button', { name: 'Archive' });
    await user.click(archiveBtns[archiveBtns.length - 1]);
    expect(handler).toHaveBeenCalledWith('archive');
  });

  it('renders no action rails when actions is empty', async () => {
    await renderTemplate(
      `<mui-swipe-action [actions]="[]"><span>Row</span></mui-swipe-action>`,
      { imports: [SwipeAction] },
    );
    expect(document.querySelector('.mui-swipe-action__rail')).not.toBeInTheDocument();
  });

  it('renders right rail when right actions provided', async () => {
    await renderTemplate(
      `<mui-swipe-action [actions]="actions"><span>Row</span></mui-swipe-action>`,
      { imports: [SwipeAction], componentProperties: { actions: rightActions } },
    );
    expect(document.querySelector('.mui-swipe-action__rail--right')).toBeInTheDocument();
    expect(document.querySelector('.mui-swipe-action__rail--left')).not.toBeInTheDocument();
  });

  it('renders left rail when left actions provided', async () => {
    await renderTemplate(
      `<mui-swipe-action [actions]="actions"><span>Row</span></mui-swipe-action>`,
      { imports: [SwipeAction], componentProperties: { actions: leftActions } },
    );
    expect(document.querySelector('.mui-swipe-action__rail--left')).toBeInTheDocument();
  });

  it('renders both rails when both sides have actions', async () => {
    const both = [...leftActions, ...rightActions];
    await renderTemplate(
      `<mui-swipe-action [actions]="actions"><span>Row</span></mui-swipe-action>`,
      { imports: [SwipeAction], componentProperties: { actions: both } },
    );
    expect(document.querySelector('.mui-swipe-action__rail--left')).toBeInTheDocument();
    expect(document.querySelector('.mui-swipe-action__rail--right')).toBeInTheDocument();
  });

  it('has a group landmark for accessible actions', async () => {
    await renderTemplate(
      `<mui-swipe-action [actions]="actions"><span>Row</span></mui-swipe-action>`,
      { imports: [SwipeAction], componentProperties: { actions: rightActions } },
    );
    expect(screen.getByRole('group', { name: 'Row actions' })).toBeInTheDocument();
  });
});
