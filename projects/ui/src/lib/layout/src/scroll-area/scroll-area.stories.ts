import type { Meta, StoryObj } from '@storybook/angular';
import { ScrollArea } from './scroll-area';

const meta: Meta<ScrollArea> = {
  title: 'Layout/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    orientation: { control: 'select', options: ['vertical', 'horizontal', 'both'] },
  },
};
export default meta;
type Story = StoryObj<ScrollArea>;

const items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);
const itemsHtml = items
  .map(
    (item) =>
      `<div style="padding:8px 12px;border-bottom:1px solid var(--mui-color-border);font-family:var(--mui-font-sans);font-size:14px;color:var(--mui-color-text);">${item}</div>`,
  )
  .join('');

export const Default: Story = {
  render: () => ({
    imports: [ScrollArea],
    template: `
      <mui-scroll-area style="height:200px;width:300px;border:1px solid var(--mui-color-border);border-radius:var(--mui-radius-md);">
        ${itemsHtml}
      </mui-scroll-area>
    `,
  }),
};

export const Vertical: Story = {
  render: () => ({
    imports: [ScrollArea],
    template: `
      <mui-scroll-area style="height:200px;width:300px;border:1px solid var(--mui-color-border);border-radius:var(--mui-radius-md);">
        ${itemsHtml}
      </mui-scroll-area>
    `,
  }),
};

export const Horizontal: Story = {
  render: () => ({
    imports: [ScrollArea],
    template: `
      <mui-scroll-area orientation="horizontal" style="width:300px;border:1px solid var(--mui-color-border);border-radius:var(--mui-radius-md);">
        <div style="display:flex;gap:8px;padding:12px;min-width:max-content;">
          ${Array.from(
            { length: 15 },
            (_, i) =>
              `<div style="min-width:80px;height:60px;border-radius:6px;background:color-mix(in srgb,var(--mui-color-primary) ${10 + i * 5}%,transparent);display:flex;align-items:center;justify-content:center;font-family:var(--mui-font-sans);font-size:12px;color:var(--mui-color-text);">Card ${i + 1}</div>`,
          ).join('')}
        </div>
      </mui-scroll-area>
    `,
  }),
};

export const Both: Story = {
  render: () => ({
    imports: [ScrollArea],
    template: `
      <mui-scroll-area orientation="both" style="width:300px;height:200px;border:1px solid var(--mui-color-border);border-radius:var(--mui-radius-md);">
        <div style="min-width:600px;padding:12px;">
          ${Array.from(
            { length: 20 },
            (_, i) =>
              `<div style="white-space:nowrap;padding:6px 0;font-family:var(--mui-font-sans);font-size:14px;color:var(--mui-color-text);">Row ${i + 1}: This is a very long line of content that requires horizontal scrolling to see in full</div>`,
          ).join('')}
        </div>
      </mui-scroll-area>
    `,
  }),
};

export const Accessibility: Story = {
  render: () => ({
    imports: [ScrollArea],
    template: `
      <p style="font-family:var(--mui-font-sans);font-size:13px;color:var(--mui-color-text-muted);margin-bottom:12px;max-width:320px;">
        ScrollArea is a layout component. Ensure the scrollable region is reachable by keyboard (Tab into content).
      </p>
      <mui-scroll-area style="height:160px;width:320px;border:1px solid var(--mui-color-border);border-radius:var(--mui-radius-md);" tabindex="0">
        ${itemsHtml}
      </mui-scroll-area>
    `,
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    imports: [ScrollArea],
    template: `
      <div style="width:375px;padding:16px;">
        <mui-scroll-area style="height:240px;border:1px solid var(--mui-color-border);border-radius:var(--mui-radius-md);">
          ${itemsHtml}
        </mui-scroll-area>
      </div>
    `,
  }),
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
