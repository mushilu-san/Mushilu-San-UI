import type { Meta, StoryObj } from '@storybook/angular';
import { Skeleton } from './skeleton';

const meta: Meta<Skeleton> = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'select', options: ['text', 'rect', 'circle'] },
    width: { control: 'text' },
    height: { control: 'text' },
    lines: { control: { type: 'number', min: 1, max: 8 } },
  },
};

export default meta;
type Story = StoryObj<Skeleton>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width:420px;">
        <mui-skeleton [variant]="variant" [width]="width" [height]="height" [lines]="lines"></mui-skeleton>
      </div>
    `,
    imports: [Skeleton],
  }),
  args: { variant: 'text', lines: 3 },
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:24px;max-width:420px;">
        <mui-skeleton variant="text" lines="3"></mui-skeleton>
        <mui-skeleton variant="rect" width="100%" height="120px"></mui-skeleton>
        <mui-skeleton variant="circle" width="56px"></mui-skeleton>
      </div>
    `,
    imports: [Skeleton],
  }),
};

export const CardPlaceholder: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:16px;align-items:flex-start;max-width:420px;padding:16px;border:1px solid #e2e8f0;border-radius:12px;">
        <mui-skeleton variant="circle" width="48px"></mui-skeleton>
        <div style="flex:1;display:flex;flex-direction:column;gap:8px;">
          <mui-skeleton variant="text" width="50%"></mui-skeleton>
          <mui-skeleton variant="text" lines="2"></mui-skeleton>
        </div>
      </div>
    `,
    imports: [Skeleton],
  }),
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div role="status" aria-busy="true" aria-live="polite" aria-label="Loading content"
        style="max-width:420px;display:flex;flex-direction:column;gap:12px;">
        <mui-skeleton variant="rect" height="100px"></mui-skeleton>
        <mui-skeleton variant="text" lines="3"></mui-skeleton>
        <span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);">Loading…</span>
      </div>
    `,
    imports: [Skeleton],
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    template: `
      <div role="status" aria-busy="true" aria-label="Loading feed"
        style="width:375px;display:flex;flex-direction:column;gap:16px;">
        <mui-skeleton variant="rect" height="140px"></mui-skeleton>
        <mui-skeleton variant="text" lines="2"></mui-skeleton>
        <mui-skeleton variant="rect" height="140px"></mui-skeleton>
      </div>
    `,
    imports: [Skeleton],
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
