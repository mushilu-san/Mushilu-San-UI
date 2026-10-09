import { signal } from '@angular/core';
import { fireEvent, screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { TABS_CONTEXT } from './tabs';
import type { Tabs } from './tabs';
import { TabList } from './tab-list';

const ctx = { activeTab: signal('a'), orientation: signal('horizontal') } as unknown as Tabs;

const tabs = (dir: string) => `<div dir="${dir}">
  <mui-tab-list>
    <button role="tab" tabindex="0">A</button>
    <button role="tab" tabindex="-1">B</button>
    <button role="tab" tabindex="-1">C</button>
  </mui-tab-list></div>`;

const opts = { imports: [TabList], providers: [{ provide: TABS_CONTEXT, useValue: ctx }] };

describe('TabList RTL', () => {
  it('H-B-61716a: ArrowRight moves to the previous tab in a dir=rtl host', async () => {
    await renderTemplate(tabs('rtl'), opts);
    const t = screen.getAllByRole('tab');
    t[1].focus();
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(t[0]);
  });

  it('H-B-61716a: ArrowLeft moves to the next tab in a dir=rtl host', async () => {
    await renderTemplate(tabs('rtl'), opts);
    const t = screen.getAllByRole('tab');
    t[0].focus();
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(t[1]);
  });

  it('H-B-61716a: ArrowRight still moves to the next tab in dir=ltr', async () => {
    await renderTemplate(tabs('ltr'), opts);
    const t = screen.getAllByRole('tab');
    t[0].focus();
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(t[1]);
  });
});
