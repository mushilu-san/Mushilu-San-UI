import type { Meta, StoryObj } from '@storybook/angular';
import { Button } from './button';

const meta: Meta<Button> = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Button>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<button muiButton [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading">Button</button>`,
  }),
};

export const Primary: Story = {
  render: () => ({
    template: `<button muiButton variant="primary">Primary</button>`,
  }),
};

export const Secondary: Story = {
  render: () => ({
    template: `<button muiButton variant="secondary">Secondary</button>`,
  }),
};

export const Ghost: Story = {
  render: () => ({
    template: `<button muiButton variant="ghost">Ghost</button>`,
  }),
};

export const Destructive: Story = {
  render: () => ({
    template: `<button muiButton variant="destructive">Delete</button>`,
  }),
};

export const Loading: Story = {
  render: () => ({
    template: `<button muiButton loading>Saving…</button>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<button muiButton disabled>Disabled</button>`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:center;gap:12px;">
        <button muiButton size="sm">Small</button>
        <button muiButton size="md">Medium</button>
        <button muiButton size="lg">Large</button>
      </div>
    `,
  }),
};

export const Interactive: Story = {
  render: (args) => ({
    props: args,
    template: `<button muiButton [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading">Interactive</button>`,
  }),
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
  },
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <button muiButton>Focusable button</button>
        <button muiButton disabled aria-label="Disabled action">Disabled</button>
        <button muiButton loading aria-label="Saving, please wait">Loading</button>
      </div>
    `,
  }),
  parameters: {
    a11y: { disable: false },
  },
};

export const MobilePreview: Story = {
  render: () => ({
    template: `
      <div style="width:375px;padding:16px;display:flex;flex-direction:column;gap:12px;">
        <button muiButton style="width:100%">Full width button</button>
        <button muiButton variant="secondary" style="width:100%">Secondary</button>
      </div>
    `,
  }),
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};
