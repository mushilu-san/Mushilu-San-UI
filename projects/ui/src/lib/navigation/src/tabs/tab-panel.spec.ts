import { signal } from '@angular/core';
import { screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { TABS_CONTEXT } from './tabs';
import type { Tabs } from './tabs';
import { TabPanel } from './tab-panel';

function makeCtx(activeTab = 'a'): Tabs {
  return {
    activeTab: signal(activeTab),
    orientation: signal('horizontal'),
  } as unknown as Tabs;
}

describe('TabPanel (isolated)', () => {
  it('renders with role=tabpanel and projects content when active', async () => {
    await renderTemplate('<mui-tab-panel value="a">Panel A</mui-tab-panel>', {
      imports: [TabPanel],
      providers: [{ provide: TABS_CONTEXT, useValue: makeCtx('a') }],
    });
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel A');
  });

  it('is hidden and empty when not the active tab', async () => {
    await renderTemplate('<mui-tab-panel value="b">Panel B</mui-tab-panel>', {
      imports: [TabPanel],
      providers: [{ provide: TABS_CONTEXT, useValue: makeCtx('a') }],
    });
    expect(screen.queryByText('Panel B')).not.toBeInTheDocument();
    expect(document.querySelector('mui-tab-panel')).toHaveAttribute('hidden');
  });

  it('sets id to mui-tabpanel-<value>', async () => {
    await renderTemplate('<mui-tab-panel value="a">Panel A</mui-tab-panel>', {
      imports: [TabPanel],
      providers: [{ provide: TABS_CONTEXT, useValue: makeCtx('a') }],
    });
    expect(screen.getByRole('tabpanel')).toHaveAttribute('id', 'mui-tabpanel-a');
  });

  it('sets aria-labelledby to mui-tab-<value>', async () => {
    await renderTemplate('<mui-tab-panel value="a">Panel A</mui-tab-panel>', {
      imports: [TabPanel],
      providers: [{ provide: TABS_CONTEXT, useValue: makeCtx('a') }],
    });
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'mui-tab-a');
  });

  it('has tabindex=0', async () => {
    await renderTemplate('<mui-tab-panel value="a">Panel A</mui-tab-panel>', {
      imports: [TabPanel],
      providers: [{ provide: TABS_CONTEXT, useValue: makeCtx('a') }],
    });
    expect(screen.getByRole('tabpanel')).toHaveAttribute('tabindex', '0');
  });
});
