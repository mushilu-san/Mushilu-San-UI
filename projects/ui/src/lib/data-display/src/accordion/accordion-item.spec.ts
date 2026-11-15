import { signal } from '@angular/core';
import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { AccordionItem } from './accordion-item';
import { AccordionGroup } from './accordion';
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

describe('AccordionItem open state and heading (#878)', () => {
  it('works standalone: [open] starts it open and a click toggles it', async () => {
    await renderTemplate(
      '<mui-accordion-item heading="Contents" [open]="true">Body</mui-accordion-item>',
      {
        imports: [AccordionItem],
      },
    );
    const btn = screen.getByRole('button', { name: 'Contents' });
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('emits openChange when toggled', async () => {
    const changed = vi.fn();
    await renderTemplate(
      '<mui-accordion-item heading="Contents" (openChange)="c($event)">Body</mui-accordion-item>',
      { imports: [AccordionItem], componentProperties: { c: changed } },
    );
    await userEvent.click(screen.getByRole('button', { name: 'Contents' }));
    expect(changed).toHaveBeenCalledWith(true);
  });

  it('inside a group, [open] opens that item and single-open closes the previous one', async () => {
    await renderTemplate(
      `<mui-accordion>
        <mui-accordion-item heading="A" [open]="true">a</mui-accordion-item>
        <mui-accordion-item heading="B">b</mui-accordion-item>
      </mui-accordion>`,
      { imports: [AccordionItem, AccordionGroup] },
    );
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'B' }));
    expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('headingLevel wraps the trigger in a real heading', async () => {
    await renderTemplate(
      '<mui-accordion-item heading="Contents" headingLevel="2">Body</mui-accordion-item>',
      { imports: [AccordionItem] },
    );
    expect(screen.getByRole('heading', { level: 2 })).toContainElement(
      screen.getByRole('button', { name: 'Contents' }),
    );
  });

  it('has no heading wrapper without headingLevel', async () => {
    await renderTemplate('<mui-accordion-item heading="Contents">Body</mui-accordion-item>', {
      imports: [AccordionItem],
    });
    expect(screen.queryByRole('heading')).toBeNull();
  });

  it('projects rich heading content with slot="heading"', async () => {
    await renderTemplate(
      '<mui-accordion-item><b slot="heading">On this page</b>Body</mui-accordion-item>',
      { imports: [AccordionItem] },
    );
    expect(screen.getByRole('button', { name: 'On this page' })).toBeInTheDocument();
  });
});
