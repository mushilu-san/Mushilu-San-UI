import type { Meta, StoryObj } from '@storybook/angular';
import { Pager } from './pager';
import { PagerLink } from './pager-link';

const meta: Meta<Pager> = {
  component: Pager,
  title: 'Navigation/Pager',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<Pager>;

export const Default: Story = {
  render: () => ({
    imports: [Pager, PagerLink],
    template: `<mui-pager label="Series navigation"><a muiPagerLink direction="previous" href="#p1" directionLabel="Previous">Part 1</a><a muiPagerLink direction="next" href="#p3" directionLabel="Next">Part 3</a></mui-pager>`,
  }),
};

export const RightToLeft: Story = {
  render: () => ({
    imports: [Pager, PagerLink],
    template: `<div dir="rtl"><mui-pager label="Series navigation"><a muiPagerLink direction="previous" href="#p1" directionLabel="הקודם">Part 1</a><a muiPagerLink direction="next" href="#p3" directionLabel="הבא">Part 3</a></mui-pager></div>`,
  }),
};

export const Interactive: Story = {
  render: () => ({
    imports: [Pager, PagerLink],
    template: `<mui-pager label="Series navigation"><a muiPagerLink direction="previous" href="#p1" directionLabel="Previous">Part 1</a><a muiPagerLink direction="next" href="#p3" directionLabel="Next">Part 3</a></mui-pager>`,
  }),
};

export const Accessibility: Story = {
  parameters: { a11y: { disable: false } },
  render: () => ({
    imports: [Pager, PagerLink],
    template: `<mui-pager label="Series navigation"><a muiPagerLink direction="previous" href="#p1" directionLabel="Previous">Part 1</a><a muiPagerLink direction="next" href="#p3" directionLabel="Next">Part 3</a></mui-pager>`,
  }),
};

export const MobilePreview: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    imports: [Pager, PagerLink],
    template: `<div style="max-width:360px"><mui-pager label="Series navigation"><a muiPagerLink direction="previous" href="#p1" directionLabel="Previous">Part 1</a><a muiPagerLink direction="next" href="#p3" directionLabel="Next">Part 3</a></mui-pager></div>`,
  }),
};
