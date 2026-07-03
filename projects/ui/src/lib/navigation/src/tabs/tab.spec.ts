import { signal } from '@angular/core';
import { fireEvent, screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { TABS_CONTEXT } from './tabs';
import type { Tabs } from './tabs';
import { Tab } from './tab';

function makeCtx(activeTab = 'a'): Tabs {
  return {
    activeTab: signal(activeTab),
    orientation: signal('horizontal'),
  } as unknown as Tabs;
}

describe('Tab (isolated)', () => {
  it('renders with role=tab', async () => {
    await renderTemplate('<mui-tab value="a">A</mui-tab>', {
      imports: [Tab],
      providers: [{ provide: TABS_CONTEXT, useValue: makeCtx('a') }],
    });
    expect(screen.getByRole('tab')).toBeInTheDocument();
  });

  it('sets aria-selected=true when ctx.activeTab() matches its value', async () => {
    await renderTemplate('<mui-tab value="a">A</mui-tab>', {
      imports: [Tab],
      providers: [{ provide: TABS_CONTEXT, useValue: makeCtx('a') }],
    });
    expect(screen.getByRole('tab')).toHaveAttribute('aria-selected', 'true');
  });

  it('sets aria-selected=false when it does not match', async () => {
    await renderTemplate('<mui-tab value="b">B</mui-tab>', {
      imports: [Tab],
      providers: [{ provide: TABS_CONTEXT, useValue: makeCtx('a') }],
    });
    expect(screen.getByRole('tab')).toHaveAttribute('aria-selected', 'false');
  });

  it('clicking sets ctx.activeTab() to its value', async () => {
    const ctx = makeCtx('a');
    await renderTemplate('<mui-tab value="b">B</mui-tab>', {
      imports: [Tab],
      providers: [{ provide: TABS_CONTEXT, useValue: ctx }],
    });
    fireEvent.click(screen.getByRole('tab'));
    expect(ctx.activeTab()).toBe('b');
  });

  it('disabled tab does not set ctx.activeTab() on click', async () => {
    const ctx = makeCtx('a');
    await renderTemplate('<mui-tab value="b" disabled>B</mui-tab>', {
      imports: [Tab],
      providers: [{ provide: TABS_CONTEXT, useValue: ctx }],
    });
    fireEvent.click(screen.getByRole('tab'));
    expect(ctx.activeTab()).toBe('a');
    expect(screen.getByRole('tab')).toHaveAttribute('aria-disabled', 'true');
  });

  it('Enter key activates the tab', async () => {
    const ctx = makeCtx('a');
    await renderTemplate('<mui-tab value="b">B</mui-tab>', {
      imports: [Tab],
      providers: [{ provide: TABS_CONTEXT, useValue: ctx }],
    });
    fireEvent.keyDown(screen.getByRole('tab'), { key: 'Enter' });
    expect(ctx.activeTab()).toBe('b');
  });

  it('Space key activates the tab', async () => {
    const ctx = makeCtx('a');
    await renderTemplate('<mui-tab value="b">B</mui-tab>', {
      imports: [Tab],
      providers: [{ provide: TABS_CONTEXT, useValue: ctx }],
    });
    fireEvent.keyDown(screen.getByRole('tab'), { key: ' ' });
    expect(ctx.activeTab()).toBe('b');
  });

  it('sets tabindex=0 when active, -1 when inactive', async () => {
    await renderTemplate('<mui-tab value="a">A</mui-tab><mui-tab value="b">B</mui-tab>', {
      imports: [Tab],
      providers: [{ provide: TABS_CONTEXT, useValue: makeCtx('a') }],
    });
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('tabindex', '0');
    expect(tabs[1]).toHaveAttribute('tabindex', '-1');
  });
});
