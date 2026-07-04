import { signal } from '@angular/core';
import { fireEvent, screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { TABS_CONTEXT } from './tabs';
import type { Tabs } from './tabs';
import { TabList } from './tab-list';

function makeCtx(orientation: 'horizontal' | 'vertical' = 'horizontal'): Tabs {
  return {
    activeTab: signal('a'),
    orientation: signal(orientation),
  } as unknown as Tabs;
}

const PLAIN_TABS = `
  <mui-tab-list>
    <button role="tab" tabindex="0">A</button>
    <button role="tab" tabindex="-1">B</button>
    <button role="tab" tabindex="-1">C</button>
  </mui-tab-list>
`;

describe('TabList (isolated)', () => {
  it('renders with role=tablist', async () => {
    await renderTemplate(PLAIN_TABS, {
      imports: [TabList],
      providers: [{ provide: TABS_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('sets aria-orientation to reflect ctx.orientation()', async () => {
    await renderTemplate(PLAIN_TABS, {
      imports: [TabList],
      providers: [{ provide: TABS_CONTEXT, useValue: makeCtx('vertical') }],
    });
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('exposes part="tab-list"', async () => {
    await renderTemplate(PLAIN_TABS, {
      imports: [TabList],
      providers: [{ provide: TABS_CONTEXT, useValue: makeCtx() }],
    });
    expect(screen.getByRole('tablist')).toHaveAttribute('part', 'tab-list');
  });

  it('ArrowRight moves focus to the next projected tab in horizontal orientation', async () => {
    await renderTemplate(PLAIN_TABS, {
      imports: [TabList],
      providers: [{ provide: TABS_CONTEXT, useValue: makeCtx('horizontal') }],
    });
    const tabs = screen.getAllByRole('tab');
    tabs[0].focus();
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(tabs[1]);
  });

  it('ArrowDown moves focus to the next projected tab in vertical orientation', async () => {
    await renderTemplate(PLAIN_TABS, {
      imports: [TabList],
      providers: [{ provide: TABS_CONTEXT, useValue: makeCtx('vertical') }],
    });
    const tabs = screen.getAllByRole('tab');
    tabs[0].focus();
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(tabs[1]);
  });

  it('ArrowRight does not move focus in vertical orientation', async () => {
    await renderTemplate(PLAIN_TABS, {
      imports: [TabList],
      providers: [{ provide: TABS_CONTEXT, useValue: makeCtx('vertical') }],
    });
    const tabs = screen.getAllByRole('tab');
    tabs[0].focus();
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(tabs[0]);
  });

  it('skips tabs that carry aria-disabled="true"', async () => {
    await renderTemplate(
      `<mui-tab-list>
        <button role="tab" tabindex="0">A</button>
        <button role="tab" aria-disabled="true" tabindex="-1">B</button>
        <button role="tab" tabindex="-1">C</button>
      </mui-tab-list>`,
      { imports: [TabList], providers: [{ provide: TABS_CONTEXT, useValue: makeCtx() }] },
    );
    const tabs = screen.getAllByRole('tab');
    tabs[0].focus();
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(tabs[2]);
  });
});
