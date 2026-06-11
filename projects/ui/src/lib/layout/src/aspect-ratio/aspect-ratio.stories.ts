import type { Meta, StoryObj } from '@storybook/angular';
import { AspectRatio } from './aspect-ratio';

const meta: Meta<AspectRatio> = {
  title: 'Layout/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: { ratio: { control: { type: 'number', step: 0.1 } } },
};
export default meta;
type Story = StoryObj<AspectRatio>;

const placeholder = (label: string, bg = 'var(--mui-color-surface)') =>
  `<div style="width:100%;height:100%;background:${bg};display:flex;align-items:center;justify-content:center;font-family:var(--mui-font-sans);font-size:14px;color:var(--mui-color-text-muted);">${label}</div>`;

export const Widescreen: Story = {
  render: () => ({
    imports: [AspectRatio],
    template: `
      <div style="max-width:500px;">
        <mui-aspect-ratio [ratio]="16/9">
          ${placeholder('16 / 9', 'var(--mui-color-primary)')}
        </mui-aspect-ratio>
      </div>
    `,
  }),
};

export const Square: Story = {
  render: () => ({
    imports: [AspectRatio],
    template: `
      <div style="max-width:300px;">
        <mui-aspect-ratio [ratio]="1">
          ${placeholder('1 / 1', 'color-mix(in srgb, var(--mui-color-primary) 20%, transparent)')}
        </mui-aspect-ratio>
      </div>
    `,
  }),
};

export const AllRatios: Story = {
  render: () => ({
    imports: [AspectRatio],
    template: `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:700px;">
        <div>
          <p style="font-family:var(--mui-font-sans);font-size:12px;color:var(--mui-color-text-muted);margin:0 0 4px;">16/9</p>
          <mui-aspect-ratio [ratio]="16/9">${placeholder('16/9')}</mui-aspect-ratio>
        </div>
        <div>
          <p style="font-family:var(--mui-font-sans);font-size:12px;color:var(--mui-color-text-muted);margin:0 0 4px;">4/3</p>
          <mui-aspect-ratio [ratio]="4/3">${placeholder('4/3')}</mui-aspect-ratio>
        </div>
        <div>
          <p style="font-family:var(--mui-font-sans);font-size:12px;color:var(--mui-color-text-muted);margin:0 0 4px;">1/1</p>
          <mui-aspect-ratio [ratio]="1">${placeholder('1/1')}</mui-aspect-ratio>
        </div>
        <div>
          <p style="font-family:var(--mui-font-sans);font-size:12px;color:var(--mui-color-text-muted);margin:0 0 4px;">21/9</p>
          <mui-aspect-ratio [ratio]="21/9">${placeholder('21/9')}</mui-aspect-ratio>
        </div>
        <div>
          <p style="font-family:var(--mui-font-sans);font-size:12px;color:var(--mui-color-text-muted);margin:0 0 4px;">9/16 (portrait)</p>
          <mui-aspect-ratio [ratio]="9/16">${placeholder('9/16')}</mui-aspect-ratio>
        </div>
        <div>
          <p style="font-family:var(--mui-font-sans);font-size:12px;color:var(--mui-color-text-muted);margin:0 0 4px;">3/4</p>
          <mui-aspect-ratio [ratio]="3/4">${placeholder('3/4')}</mui-aspect-ratio>
        </div>
      </div>
    `,
  }),
};

export const Accessibility: Story = {
  render: () => ({
    imports: [AspectRatio],
    template: `
      <div style="max-width:400px;">
        <p style="font-family:var(--mui-font-sans);font-size:13px;color:var(--mui-color-text-muted);margin-bottom:12px;">
          Aspect ratio is a layout-only component. Ensure any media inside has correct alt text or aria labels.
        </p>
        <mui-aspect-ratio [ratio]="16/9">
          <img src="https://placehold.co/800x450" alt="A placeholder landscape image at 16:9 aspect ratio" style="width:100%;height:100%;object-fit:cover;" />
        </mui-aspect-ratio>
      </div>
    `,
  }),
  parameters: { a11y: { disable: false } },
};
