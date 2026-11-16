import type { Meta, StoryObj } from '@storybook/angular';
import { ImageZoom } from './image-zoom';

const meta: Meta<ImageZoom> = {
  component: ImageZoom,
  title: 'Data Display/ImageZoom',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<ImageZoom>;

export const Default: Story = {
  render: () => ({
    imports: [ImageZoom],
    template: `<mui-image-zoom src="data:image/svg+xml;utf8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27100%27%3E%3Crect width=%27160%27 height=%27100%27 fill=%27%236366f1%27/%3E%3C/svg%3E" alt="Certificate of completion" caption="Issued 2026" />`,
  }),
};

export const WithoutCaption: Story = {
  render: () => ({
    imports: [ImageZoom],
    template: `<mui-image-zoom src="data:image/svg+xml;utf8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27100%27%3E%3Crect width=%27160%27 height=%27100%27 fill=%27%236366f1%27/%3E%3C/svg%3E" alt="Certificate of completion" />`,
  }),
};

export const Interactive: Story = {
  render: () => ({
    imports: [ImageZoom],
    template: `<mui-image-zoom src="data:image/svg+xml;utf8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27100%27%3E%3Crect width=%27160%27 height=%27100%27 fill=%27%236366f1%27/%3E%3C/svg%3E" alt="Certificate of completion" caption="Issued 2026" />`,
  }),
};

export const Accessibility: Story = {
  parameters: { a11y: { disable: false } },
  render: () => ({
    imports: [ImageZoom],
    template: `<mui-image-zoom src="data:image/svg+xml;utf8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27100%27%3E%3Crect width=%27160%27 height=%27100%27 fill=%27%236366f1%27/%3E%3C/svg%3E" alt="Certificate of completion" caption="Issued 2026" />`,
  }),
};

export const MobilePreview: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    imports: [ImageZoom],
    template: `<div style="padding:1rem"><mui-image-zoom src="data:image/svg+xml;utf8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27100%27%3E%3Crect width=%27160%27 height=%27100%27 fill=%27%236366f1%27/%3E%3C/svg%3E" alt="Certificate of completion" caption="Issued 2026" /></div>`,
  }),
};
