import type { Meta, StoryObj } from '@storybook/angular';
import { Progress } from './progress';

const meta: Meta<Progress> = {
  title: 'Feedback/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'select', options: ['linear', 'circular'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max: { control: 'number' },
    indeterminate: { control: 'boolean' },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<Progress>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width:420px;">
        <mui-progress [variant]="variant" [size]="size" [value]="value" [max]="max"
          [indeterminate]="indeterminate" [label]="label"></mui-progress>
      </div>
    `,
    imports: [Progress],
  }),
  args: { variant: 'linear', size: 'md', value: 45, max: 100, indeterminate: false, label: 'Loading' },
};

export const LinearSizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:420px;">
        <mui-progress size="sm" value="30" label="Small"></mui-progress>
        <mui-progress size="md" value="55" label="Medium"></mui-progress>
        <mui-progress size="lg" value="80" label="Large"></mui-progress>
      </div>
    `,
    imports: [Progress],
  }),
};

export const Circular: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:center;gap:24px;">
        <mui-progress variant="circular" size="sm" value="25" label="Small"></mui-progress>
        <mui-progress variant="circular" size="md" value="60" label="Medium"></mui-progress>
        <mui-progress variant="circular" size="lg" value="90" label="Large"></mui-progress>
      </div>
    `,
    imports: [Progress],
  }),
};

export const Indeterminate: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:24px;max-width:420px;">
        <mui-progress indeterminate label="Loading"></mui-progress>
        <mui-progress variant="circular" indeterminate label="Loading"></mui-progress>
      </div>
    `,
    imports: [Progress],
  }),
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:20px;max-width:420px;">
        <mui-progress value="65" label="File upload progress"></mui-progress>
        <mui-progress variant="circular" indeterminate label="Fetching results"></mui-progress>
      </div>
    `,
    imports: [Progress],
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    template: `
      <div style="width:375px;display:flex;flex-direction:column;gap:20px;">
        <mui-progress value="70" label="Downloading update"></mui-progress>
        <div style="display:flex;justify-content:center;">
          <mui-progress variant="circular" indeterminate label="Syncing"></mui-progress>
        </div>
      </div>
    `,
    imports: [Progress],
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
