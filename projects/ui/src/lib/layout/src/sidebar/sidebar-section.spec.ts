import { signal } from '@angular/core';
import { screen } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { SIDEBAR_CONTEXT } from './sidebar-context';
import type { SidebarContext } from './sidebar-context';
import { SidebarSection } from './sidebar-section';

function makeCtx(expanded = true): SidebarContext {
  return { expanded: signal(expanded), toggle: vi.fn() };
}

describe('SidebarSection', () => {
  it('projects content', async () => {
    await renderTemplate(
      '<mui-sidebar-section><div data-testid="item">Item</div></mui-sidebar-section>',
      {
        imports: [SidebarSection],
        providers: [{ provide: SIDEBAR_CONTEXT, useValue: makeCtx() }],
      },
    );
    expect(screen.getByTestId('item')).toBeInTheDocument();
  });

  it('shows the label when expanded and a label is set', async () => {
    await renderTemplate('<mui-sidebar-section label="Main">Items</mui-sidebar-section>', {
      imports: [SidebarSection],
      providers: [{ provide: SIDEBAR_CONTEXT, useValue: makeCtx(true) }],
    });
    expect(document.querySelector('.section-label')).toHaveTextContent('Main');
  });

  it('hides the label when collapsed even if a label is set', async () => {
    await renderTemplate('<mui-sidebar-section label="Main">Items</mui-sidebar-section>', {
      imports: [SidebarSection],
      providers: [{ provide: SIDEBAR_CONTEXT, useValue: makeCtx(false) }],
    });
    expect(document.querySelector('.section-label')).not.toBeInTheDocument();
  });

  it('exposes part="section" on the host', async () => {
    await renderTemplate('<mui-sidebar-section>Items</mui-sidebar-section>', {
      imports: [SidebarSection],
      providers: [{ provide: SIDEBAR_CONTEXT, useValue: makeCtx() }],
    });
    expect(document.querySelector('mui-sidebar-section')).toHaveAttribute('part', 'section');
  });
});
