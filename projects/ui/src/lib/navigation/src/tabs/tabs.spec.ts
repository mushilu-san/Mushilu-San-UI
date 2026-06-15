import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Tabs } from './tabs';
import { TabList } from './tab-list';
import { Tab } from './tab';
import { TabPanel } from './tab-panel';

const ALL = [Tabs, TabList, Tab, TabPanel];

const BASIC = `
  <mui-tabs activeTab="a">
    <mui-tab-list>
      <mui-tab value="a">Tab A</mui-tab>
      <mui-tab value="b">Tab B</mui-tab>
      <mui-tab value="c">Tab C</mui-tab>
    </mui-tab-list>
    <mui-tab-panel value="a">Panel A</mui-tab-panel>
    <mui-tab-panel value="b">Panel B</mui-tab-panel>
    <mui-tab-panel value="c">Panel C</mui-tab-panel>
  </mui-tabs>
`;

describe('Tabs', () => {
  it('renders tablist with tabs', async () => {
    await renderTemplate(BASIC, { imports: ALL });
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('shows active panel', async () => {
    await renderTemplate(BASIC, { imports: ALL });
    expect(screen.getByText('Panel A')).toBeInTheDocument();
    expect(screen.queryByText('Panel B')).toBeNull();
  });

  it('sets aria-selected on active tab', async () => {
    await renderTemplate(BASIC, { imports: ALL });
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('aria-selected', 'false');
  });

  it('sets tabindex="0" on active tab, "-1" on others', async () => {
    await renderTemplate(BASIC, { imports: ALL });
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('tabindex', '-1');
  });

  it('switches panel on tab click', async () => {
    await renderTemplate(BASIC, { imports: ALL });
    await userEvent.click(screen.getByRole('tab', { name: 'Tab B' }));
    expect(screen.getByText('Panel B')).toBeInTheDocument();
    expect(screen.queryByText('Panel A')).toBeNull();
  });

  it('links tab to panel via aria-controls / aria-labelledby', async () => {
    await renderTemplate(BASIC, { imports: ALL });
    const tab = screen.getByRole('tab', { name: 'Tab A' });
    const panel = screen.getByRole('tabpanel');
    expect(tab).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', tab.id);
  });

  it('panel has tabindex="0"', async () => {
    await renderTemplate(BASIC, { imports: ALL });
    expect(screen.getByRole('tabpanel')).toHaveAttribute('tabindex', '0');
  });

  it('disabled tab cannot be clicked', async () => {
    await renderTemplate(
      `<mui-tabs activeTab="a">
        <mui-tab-list>
          <mui-tab value="a">A</mui-tab>
          <mui-tab value="b" disabled>B</mui-tab>
        </mui-tab-list>
        <mui-tab-panel value="a">Panel A</mui-tab-panel>
        <mui-tab-panel value="b">Panel B</mui-tab-panel>
      </mui-tabs>`,
      { imports: ALL },
    );
    await userEvent.click(screen.getByRole('tab', { name: 'B' }));
    expect(screen.queryByText('Panel B')).toBeNull();
    expect(screen.getByText('Panel A')).toBeInTheDocument();
  });

  it('disabled tab has aria-disabled="true"', async () => {
    await renderTemplate(
      `<mui-tabs activeTab="a">
        <mui-tab-list>
          <mui-tab value="a">A</mui-tab>
          <mui-tab value="b" disabled>B</mui-tab>
        </mui-tab-list>
        <mui-tab-panel value="a">Panel A</mui-tab-panel>
        <mui-tab-panel value="b">Panel B</mui-tab-panel>
      </mui-tabs>`,
      { imports: ALL },
    );
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('arrow key navigation moves focus', async () => {
    await renderTemplate(BASIC, { imports: ALL });
    const tabA = screen.getByRole('tab', { name: 'Tab A' });
    const tabB = screen.getByRole('tab', { name: 'Tab B' });
    tabA.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(tabB).toHaveFocus();
  });

  it('arrow key wraps from last to first tab', async () => {
    await renderTemplate(BASIC, { imports: ALL });
    const tabC = screen.getByRole('tab', { name: 'Tab C' });
    const tabA = screen.getByRole('tab', { name: 'Tab A' });
    tabC.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(tabA).toHaveFocus();
  });

  it('Home key moves focus to first tab', async () => {
    await renderTemplate(BASIC, { imports: ALL });
    const tabC = screen.getByRole('tab', { name: 'Tab C' });
    const tabA = screen.getByRole('tab', { name: 'Tab A' });
    tabC.focus();
    await userEvent.keyboard('{Home}');
    expect(tabA).toHaveFocus();
  });

  it('End key moves focus to last tab', async () => {
    await renderTemplate(BASIC, { imports: ALL });
    const tabA = screen.getByRole('tab', { name: 'Tab A' });
    const tabC = screen.getByRole('tab', { name: 'Tab C' });
    tabA.focus();
    await userEvent.keyboard('{End}');
    expect(tabC).toHaveFocus();
  });

  it('ArrowLeft moves focus to previous tab', async () => {
    await renderTemplate(BASIC, { imports: ALL });
    const tabA = screen.getByRole('tab', { name: 'Tab A' });
    const tabB = screen.getByRole('tab', { name: 'Tab B' });
    tabB.focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(tabA).toHaveFocus();
  });

  it('ArrowLeft wraps from first tab to last', async () => {
    await renderTemplate(BASIC, { imports: ALL });
    const tabA = screen.getByRole('tab', { name: 'Tab A' });
    const tabC = screen.getByRole('tab', { name: 'Tab C' });
    tabA.focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(tabC).toHaveFocus();
  });

  it('Enter key activates a non-active tab', async () => {
    await renderTemplate(BASIC, { imports: ALL });
    const tabB = screen.getByRole('tab', { name: 'Tab B' });
    tabB.focus();
    await userEvent.keyboard('{Enter}');
    expect(tabB).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Panel B')).toBeInTheDocument();
  });

  it('Space key activates a non-active tab', async () => {
    await renderTemplate(BASIC, { imports: ALL });
    const tabB = screen.getByRole('tab', { name: 'Tab B' });
    tabB.focus();
    await userEvent.keyboard(' ');
    expect(tabB).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Panel B')).toBeInTheDocument();
  });

  it('keyboard navigation skips disabled tabs', async () => {
    await renderTemplate(
      `<mui-tabs activeTab="a">
        <mui-tab-list>
          <mui-tab value="a">A</mui-tab>
          <mui-tab value="b" disabled>B</mui-tab>
          <mui-tab value="c">C</mui-tab>
        </mui-tab-list>
        <mui-tab-panel value="a">Panel A</mui-tab-panel>
        <mui-tab-panel value="b">Panel B</mui-tab-panel>
        <mui-tab-panel value="c">Panel C</mui-tab-panel>
      </mui-tabs>`,
      { imports: ALL },
    );
    const tabA = screen.getByRole('tab', { name: 'A' });
    const tabC = screen.getByRole('tab', { name: 'C' });
    tabA.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(tabC).toHaveFocus();
  });

  it('vertical orientation: ArrowDown moves focus to next tab', async () => {
    await renderTemplate(
      `<mui-tabs activeTab="a" orientation="vertical">
        <mui-tab-list>
          <mui-tab value="a">A</mui-tab>
          <mui-tab value="b">B</mui-tab>
        </mui-tab-list>
        <mui-tab-panel value="a">Panel A</mui-tab-panel>
        <mui-tab-panel value="b">Panel B</mui-tab-panel>
      </mui-tabs>`,
      { imports: ALL },
    );
    const tabA = screen.getByRole('tab', { name: 'A' });
    const tabB = screen.getByRole('tab', { name: 'B' });
    tabA.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(tabB).toHaveFocus();
  });

  it('vertical orientation: ArrowUp moves focus to previous tab', async () => {
    await renderTemplate(
      `<mui-tabs activeTab="b" orientation="vertical">
        <mui-tab-list>
          <mui-tab value="a">A</mui-tab>
          <mui-tab value="b">B</mui-tab>
        </mui-tab-list>
        <mui-tab-panel value="a">Panel A</mui-tab-panel>
        <mui-tab-panel value="b">Panel B</mui-tab-panel>
      </mui-tabs>`,
      { imports: ALL },
    );
    const tabA = screen.getByRole('tab', { name: 'A' });
    const tabB = screen.getByRole('tab', { name: 'B' });
    tabB.focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(tabA).toHaveFocus();
  });
});
