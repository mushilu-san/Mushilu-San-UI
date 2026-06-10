import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { AccordionGroup } from './accordion';
import { AccordionItem } from './accordion-item';

const IMPORTS = [AccordionGroup, AccordionItem];

const THREE_ITEMS = `
  <mui-accordion>
    <mui-accordion-item heading="First">Content 1</mui-accordion-item>
    <mui-accordion-item heading="Second">Content 2</mui-accordion-item>
    <mui-accordion-item heading="Third" disabled>Content 3</mui-accordion-item>
  </mui-accordion>
`;

describe('Accordion', () => {
  it('renders all item trigger buttons', async () => {
    await renderTemplate(THREE_ITEMS, { imports: IMPORTS });
    expect(screen.getByRole('button', { name: 'First' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Second' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Third' })).toBeInTheDocument();
  });

  it('all panels are hidden by default', async () => {
    await renderTemplate(THREE_ITEMS, { imports: IMPORTS });
    const panels = document.querySelectorAll('[role="region"]');
    panels.forEach((p) => expect(p).toHaveAttribute('hidden'));
  });

  it('opens a panel on trigger click', async () => {
    await renderTemplate(THREE_ITEMS, { imports: IMPORTS });
    const btn = screen.getByRole('button', { name: 'First' });
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    const panel = document.getElementById(btn.getAttribute('aria-controls')!);
    expect(panel).not.toHaveAttribute('hidden');
  });

  it('closes an open panel on second click', async () => {
    await renderTemplate(THREE_ITEMS, { imports: IMPORTS });
    const btn = screen.getByRole('button', { name: 'First' });
    await userEvent.click(btn);
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('single mode: closes previous item when a new one opens', async () => {
    await renderTemplate(THREE_ITEMS, { imports: IMPORTS });
    const first  = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });
    await userEvent.click(first);
    await userEvent.click(second);
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(second).toHaveAttribute('aria-expanded', 'true');
  });

  it('multiple mode: allows several panels open at once', async () => {
    await renderTemplate(
      `<mui-accordion [multiple]="true">
        <mui-accordion-item heading="A">1</mui-accordion-item>
        <mui-accordion-item heading="B">2</mui-accordion-item>
      </mui-accordion>`,
      { imports: IMPORTS },
    );
    await userEvent.click(screen.getByRole('button', { name: 'A' }));
    await userEvent.click(screen.getByRole('button', { name: 'B' }));
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('disabled item does not toggle', async () => {
    await renderTemplate(THREE_ITEMS, { imports: IMPORTS });
    const btn = screen.getByRole('button', { name: 'Third' });
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('disabled trigger has aria-disabled', async () => {
    await renderTemplate(THREE_ITEMS, { imports: IMPORTS });
    expect(screen.getByRole('button', { name: 'Third' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('panel has aria-labelledby pointing to its trigger', async () => {
    await renderTemplate(THREE_ITEMS, { imports: IMPORTS });
    const trigger = screen.getByRole('button', { name: 'First' });
    const panel   = document.getElementById(trigger.getAttribute('aria-controls')!);
    expect(panel?.getAttribute('aria-labelledby')).toBe(trigger.id);
  });

  it('ArrowDown moves focus to the next enabled item', async () => {
    await renderTemplate(THREE_ITEMS, { imports: IMPORTS });
    const first = screen.getByRole('button', { name: 'First' });
    first.focus();
    fireEvent.keyDown(first.closest('mui-accordion-item')!, { key: 'ArrowDown' });
    expect(screen.getByRole('button', { name: 'Second' })).toHaveFocus();
  });

  it('ArrowUp moves focus to the previous enabled item', async () => {
    await renderTemplate(THREE_ITEMS, { imports: IMPORTS });
    const second = screen.getByRole('button', { name: 'Second' });
    second.focus();
    fireEvent.keyDown(second.closest('mui-accordion-item')!, { key: 'ArrowUp' });
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
  });

  it('Home moves focus to the first enabled item', async () => {
    await renderTemplate(THREE_ITEMS, { imports: IMPORTS });
    const second = screen.getByRole('button', { name: 'Second' });
    second.focus();
    fireEvent.keyDown(second.closest('mui-accordion-item')!, { key: 'Home' });
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
  });

  it('End moves focus to the last enabled item (skipping disabled)', async () => {
    await renderTemplate(THREE_ITEMS, { imports: IMPORTS });
    const first = screen.getByRole('button', { name: 'First' });
    first.focus();
    // Third is disabled → last enabled = Second
    fireEvent.keyDown(first.closest('mui-accordion-item')!, { key: 'End' });
    expect(screen.getByRole('button', { name: 'Second' })).toHaveFocus();
  });
});
