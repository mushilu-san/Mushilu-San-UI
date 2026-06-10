import type { Meta, StoryObj } from '@storybook/angular';
import { Tooltip } from './tooltip';

const meta: Meta = {
  title: 'Data Display/Tooltip',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    imports: [Tooltip],
    template: `
      <div style="padding: 4rem; display: flex; justify-content: center;">
        <button
          muiButton
          [muiTooltip]="'Keyboard shortcut: Ctrl + S'"
          style="padding: 0.5rem 1rem; border: 1px solid var(--mui-color-border); border-radius: var(--mui-radius-md); background: var(--mui-color-surface); cursor: pointer;"
        >
          Save
        </button>
      </div>
    `,
  }),
};

export const Placements: Story = {
  render: () => ({
    imports: [Tooltip],
    template: `
      <div style="padding: 5rem; display: grid; grid-template-columns: repeat(3, auto); gap: 1.5rem; place-items: center; max-width: 400px; margin: 0 auto;">
        <div></div>
        <button [muiTooltip]="'Top tooltip'" placement="top" style="padding: 0.5rem 1rem; border: 1px solid var(--mui-color-border); border-radius: var(--mui-radius-md); background: var(--mui-color-surface); cursor: pointer;">Top</button>
        <div></div>
        <button [muiTooltip]="'Left tooltip'" placement="left" style="padding: 0.5rem 1rem; border: 1px solid var(--mui-color-border); border-radius: var(--mui-radius-md); background: var(--mui-color-surface); cursor: pointer;">Left</button>
        <div></div>
        <button [muiTooltip]="'Right tooltip'" placement="right" style="padding: 0.5rem 1rem; border: 1px solid var(--mui-color-border); border-radius: var(--mui-radius-md); background: var(--mui-color-surface); cursor: pointer;">Right</button>
        <div></div>
        <button [muiTooltip]="'Bottom tooltip'" placement="bottom" style="padding: 0.5rem 1rem; border: 1px solid var(--mui-color-border); border-radius: var(--mui-radius-md); background: var(--mui-color-surface); cursor: pointer;">Bottom</button>
        <div></div>
      </div>
    `,
  }),
};

export const OnIcon: Story = {
  render: () => ({
    imports: [Tooltip],
    template: `
      <div style="padding: 4rem; display: flex; justify-content: center; gap: 1rem; align-items: center;">
        <span style="font-size: var(--mui-font-size-sm); color: var(--mui-color-text);">Required field</span>
        <button
          aria-label="More information about required fields"
          [muiTooltip]="'This field must be filled in before submitting the form.'"
          style="display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; border: 1px solid var(--mui-color-border); background: var(--mui-color-surface); font-size: 0.7rem; cursor: pointer;"
        >
          ?
        </button>
      </div>
    `,
  }),
};

export const Accessibility: Story = {
  parameters: { a11y: { disable: false } },
  render: () => ({
    imports: [Tooltip],
    template: `
      <div style="padding: 4rem; display: flex; gap: 1rem; justify-content: center;">
        <!-- aria-describedby is set automatically when tooltip is visible -->
        <button
          [muiTooltip]="'Deletes the selected item permanently. This action cannot be undone.'"
          placement="bottom"
          style="padding: 0.5rem 1rem; border: 1px solid var(--mui-color-danger); border-radius: var(--mui-radius-md); background: var(--mui-color-danger-subtle); color: var(--mui-color-danger); cursor: pointer;"
        >
          Delete
        </button>
        <button
          [muiTooltip]="'Saves your changes without closing.'"
          style="padding: 0.5rem 1rem; border: 1px solid var(--mui-color-border); border-radius: var(--mui-radius-md); background: var(--mui-color-surface); cursor: pointer;"
        >
          Save
        </button>
      </div>
    `,
  }),
};

export const MobilePreview: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    imports: [Tooltip],
    template: `
      <div style="padding: 3rem 1rem; display: flex; justify-content: center;">
        <button
          [muiTooltip]="'Touch and hold to see tooltip on mobile'"
          style="padding: 0.75rem 1.5rem; border: 1px solid var(--mui-color-border); border-radius: var(--mui-radius-md); background: var(--mui-color-surface); cursor: pointer;"
        >
          Tap me
        </button>
      </div>
    `,
  }),
};
