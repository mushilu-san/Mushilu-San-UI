import type { Meta, StoryObj } from '@storybook/angular';
import { Tabs } from './tabs';
import { TabList } from './tab-list';
import { Tab } from './tab';
import { TabPanel } from './tab-panel';

const ALL = [Tabs, TabList, Tab, TabPanel];

const meta: Meta<Tabs> = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    activeTab: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<Tabs>;

export const Default: Story = {
  render: () => ({
    props: {},
    template: `
      <mui-tabs activeTab="overview">
        <mui-tab-list>
          <mui-tab value="overview">Overview</mui-tab>
          <mui-tab value="activity">Activity</mui-tab>
          <mui-tab value="settings">Settings</mui-tab>
        </mui-tab-list>
        <mui-tab-panel value="overview">
          <p>Overview content goes here.</p>
        </mui-tab-panel>
        <mui-tab-panel value="activity">
          <p>Recent activity feed.</p>
        </mui-tab-panel>
        <mui-tab-panel value="settings">
          <p>Configure your settings.</p>
        </mui-tab-panel>
      </mui-tabs>
    `,
    imports: ALL,
  }),
};

export const WithDisabledTab: Story = {
  render: () => ({
    props: {},
    template: `
      <mui-tabs activeTab="tab1">
        <mui-tab-list>
          <mui-tab value="tab1">Available</mui-tab>
          <mui-tab value="tab2" disabled>Disabled</mui-tab>
          <mui-tab value="tab3">Another</mui-tab>
        </mui-tab-list>
        <mui-tab-panel value="tab1">Tab 1 content</mui-tab-panel>
        <mui-tab-panel value="tab2">Tab 2 content (inaccessible)</mui-tab-panel>
        <mui-tab-panel value="tab3">Tab 3 content</mui-tab-panel>
      </mui-tabs>
    `,
    imports: ALL,
  }),
};

export const Vertical: Story = {
  render: () => ({
    props: {},
    template: `
      <mui-tabs activeTab="profile" orientation="vertical" style="display:flex;gap:16px;">
        <mui-tab-list style="min-width:140px;">
          <mui-tab value="profile">Profile</mui-tab>
          <mui-tab value="billing">Billing</mui-tab>
          <mui-tab value="security">Security</mui-tab>
        </mui-tab-list>
        <div style="flex:1;">
          <mui-tab-panel value="profile">Profile settings</mui-tab-panel>
          <mui-tab-panel value="billing">Billing details</mui-tab-panel>
          <mui-tab-panel value="security">Security options</mui-tab-panel>
        </div>
      </mui-tabs>
    `,
    imports: ALL,
  }),
};

export const Accessibility: Story = {
  parameters: { a11y: { disable: false } },
  render: () => ({
    props: {},
    template: `
      <mui-tabs activeTab="tab-a">
        <mui-tab-list>
          <mui-tab value="tab-a">Tab A</mui-tab>
          <mui-tab value="tab-b">Tab B</mui-tab>
          <mui-tab value="tab-c" disabled>Disabled</mui-tab>
        </mui-tab-list>
        <mui-tab-panel value="tab-a">Content for Tab A</mui-tab-panel>
        <mui-tab-panel value="tab-b">Content for Tab B</mui-tab-panel>
        <mui-tab-panel value="tab-c">Content for disabled tab</mui-tab-panel>
      </mui-tabs>
    `,
    imports: ALL,
  }),
};
