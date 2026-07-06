import { signal } from '@angular/core';
import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { AccordionItem } from './accordion-item';
import { ACCORDION_CONTEXT } from './accordion.types';
import type { AccordionContext } from './accordion.types';

function makeCtx(overrides: Partial<AccordionContext> = {}): AccordionContext {
  return {
    openIds: signal(new Set<string>()),
    toggle: vi.fn(),
    ...overrides,
  };
}

const TEMPLATE = '<mui-accordion-item heading="Section">Body</mui-accordion-item>';

// H-U-30e0b9: AccordionItem's ARIA wiring (aria-expanded, aria-controls,
// aria-labelledby, role=region) was only ever exercised through the full
// AccordionGroup. Provide ACCORDION_CONTEXT directly so the item is verified
// in isolation.
describe('AccordionItem (isolated)', () => {
  it('trigger has aria-controls pointing at the panel id', async () => {
    await renderTemplate(TEMPLATE, {
      imports: [AccordionItem],
      providers: [{ provide: ACCORDION_CONTEXT, useValue: makeCtx() }],
    });
    const btn = screen.getByRole('button', { name: 'Section' });
    const panel = document.querySelector('[role="region"]') as HTMLElement;
    expect(btn).toHaveAttribute('aria-controls', panel.id);
  });

  it('panel has role=region and aria-labelledby pointing at the trigger id', async () => {
    await renderTemplate(TEMPLATE, {
      imports: [AccordionItem],
      providers: [{ provide: ACCORDION_CONTEXT, useValue: makeCtx() }],
    });
    const btn = screen.getByRole('button', { name: 'Section' });
    const panel = document.querySelector('[role="region"]') as HTMLElement;
    expect(panel).toHaveAttribute('aria-labelledby', btn.id);
  });

  it('aria-expanded is false and panel is hidden when its id is absent from ctx.openIds', async () => {
    await renderTemplate(TEMPLATE, {
      imports: [AccordionItem],
      providers: [{ provide: ACCORDION_CONTEXT, useValue: makeCtx() }],
    });
    const btn = screen.getByRole('button', { name: 'Section' });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(document.querySelector('[role="region"]')).toHaveAttribute('hidden');
  });

  it('aria-expanded is true and panel is unhidden when its id is in ctx.openIds', async () => {
    const openIds = signal(new Set<string>());
    const { fixture } = await renderTemplate(TEMPLATE, {
      imports: [AccordionItem],
      providers: [{ provide: ACCORDION_CONTEXT, useValue: makeCtx({ openIds }) }],
    });
    const btn = screen.getByRole('button', { name: 'Section' });
    openIds.set(new Set([btn.id]));
    fixture.detectChanges();
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(document.querySelector('[role="region"]')).not.toHaveAttribute('hidden');
  });

  it('clicking the trigger calls ctx.toggle with its own trigger id', async () => {
    const toggle = vi.fn();
    await renderTemplate(TEMPLATE, {
      imports: [AccordionItem],
      providers: [{ provide: ACCORDION_CONTEXT, useValue: makeCtx({ toggle }) }],
    });
    const btn = screen.getByRole('button', { name: 'Section' });
    await userEvent.click(btn);
    expect(toggle).toHaveBeenCalledWith(btn.id);
  });

  it('disabled item sets aria-disabled and does not call ctx.toggle on click', async () => {
    const toggle = vi.fn();
    await renderTemplate(
      '<mui-accordion-item heading="Section" disabled>Body</mui-accordion-item>',
      {
        imports: [AccordionItem],
        providers: [{ provide: ACCORDION_CONTEXT, useValue: makeCtx({ toggle }) }],
      },
    );
    const btn = screen.getByRole('button', { name: 'Section' });
    expect(btn).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(btn);
    expect(toggle).not.toHaveBeenCalled();
  });
});
