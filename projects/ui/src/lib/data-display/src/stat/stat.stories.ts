import type { Meta, StoryObj } from '@storybook/angular';
import { Stat } from './stat';
import { Stats } from './stats';

const meta: Meta<Stat> = {
  component: Stat,
  title: 'Data Display/Stat',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<Stat>;

export const Default: Story = {
  render: () => ({
    imports: [Stats, Stat],
    template: `<mui-stats aria-label="Site totals"><mui-stat value="1,200" label="Readers" /><mui-stat value="48" label="Articles" /><mui-stat value="98%" label="Satisfaction" /></mui-stats>`,
  }),
};

export const SingleStat: Story = {
  render: () => ({
    imports: [Stats, Stat],
    template: `<mui-stat value="42" label="Open issues" />`,
  }),
};

export const Interactive: Story = {
  render: () => ({
    imports: [Stats, Stat],
    template: `<mui-stats aria-label="Site totals"><mui-stat value="1,200" label="Readers" /><mui-stat value="48" label="Articles" /><mui-stat value="98%" label="Satisfaction" /></mui-stats>`,
  }),
};

export const Accessibility: Story = {
  parameters: { a11y: { disable: false } },
  render: () => ({
    imports: [Stats, Stat],
    template: `<mui-stats aria-label="Site totals"><mui-stat value="1,200" label="Readers" /><mui-stat value="48" label="Articles" /><mui-stat value="98%" label="Satisfaction" /></mui-stats>`,
  }),
};

export const MobilePreview: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    imports: [Stats, Stat],
    template: `<div style="max-width:360px"><mui-stats aria-label="Site totals"><mui-stat value="1,200" label="Readers" /><mui-stat value="48" label="Articles" /><mui-stat value="98%" label="Satisfaction" /></mui-stats></div>`,
  }),
};
