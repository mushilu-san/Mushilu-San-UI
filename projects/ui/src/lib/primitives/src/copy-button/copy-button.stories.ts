import type { Meta, StoryObj } from '@storybook/angular';
import { CopyButton } from './copy-button';

const meta: Meta<CopyButton> = {
  component: CopyButton,
  title: 'Primitives/CopyButton',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<CopyButton>;

export const Default: Story = {
  render: () => ({
    imports: [CopyButton],
    template: `<mui-copy-button text="npm i @mushilu-san/ui" />`,
  }),
};

export const CustomLabels: Story = {
  render: () => ({
    imports: [CopyButton],
    template: `<mui-copy-button text="x" label="העתק" copiedLabel="הועתק" [resetDelay]="3000" />`,
  }),
};

export const Interactive: Story = {
  render: () => ({
    imports: [CopyButton],
    template: `<mui-copy-button text="npm i @mushilu-san/ui" />`,
  }),
};

export const Accessibility: Story = {
  parameters: { a11y: { disable: false } },
  render: () => ({
    imports: [CopyButton],
    template: `<mui-copy-button text="npm i @mushilu-san/ui" />`,
  }),
};

export const MobilePreview: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    imports: [CopyButton],
    template: `<div style="padding:1rem"><mui-copy-button text="npm i @mushilu-san/ui" /></div>`,
  }),
};
