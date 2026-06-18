import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { Popover } from './popover';
import { PopoverTrigger } from './popover-trigger';

const ALL = [Popover, PopoverTrigger];

const meta: Meta = {
  title: 'Overlays/Popover',
  component: Popover,
  decorators: [moduleMetadata({ imports: ALL })],
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `
      <mui-popover placement="bottom-start">
        <button muiPopoverTrigger style="padding:8px 16px;border:1px solid var(--mui-color-border);border-radius:8px;background:var(--mui-color-surface);cursor:pointer;color:var(--mui-color-text)">
          Open popover
        </button>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <p style="margin:0;color:var(--mui-color-text)">This is a popover panel.</p>
          <p style="margin:0;font-size:14px;color:var(--mui-color-text-muted)">Click outside or press Escape to close.</p>
        </div>
      </mui-popover>
    `,
  }),
};

export const WithHeading: Story = {
  render: () => ({
    template: `
      <mui-popover placement="bottom-start" heading="Quick settings">
        <button muiPopoverTrigger style="padding:8px 16px;border:1px solid var(--mui-color-border);border-radius:8px;background:var(--mui-color-surface);cursor:pointer;color:var(--mui-color-text)">
          Settings
        </button>
        <p style="margin:0;color:var(--mui-color-text)">Adjust your preferences here.</p>
      </mui-popover>
    `,
  }),
};

export const Placements: Story = {
  render: () => ({
    template: `
      <div style="display:grid;grid-template-columns:repeat(3,auto);gap:12px;padding:80px;">
        <div></div>
        <mui-popover placement="top">
          <button muiPopoverTrigger style="padding:8px 16px;border:1px solid var(--mui-color-border);border-radius:8px;background:var(--mui-color-surface);cursor:pointer;color:var(--mui-color-text)">Top</button>
          <p style="margin:0;white-space:nowrap;color:var(--mui-color-text)">Placement: top</p>
        </mui-popover>
        <div></div>

        <mui-popover placement="left">
          <button muiPopoverTrigger style="padding:8px 16px;border:1px solid var(--mui-color-border);border-radius:8px;background:var(--mui-color-surface);cursor:pointer;color:var(--mui-color-text)">Left</button>
          <p style="margin:0;white-space:nowrap;color:var(--mui-color-text)">Placement: left</p>
        </mui-popover>
        <div></div>
        <mui-popover placement="right">
          <button muiPopoverTrigger style="padding:8px 16px;border:1px solid var(--mui-color-border);border-radius:8px;background:var(--mui-color-surface);cursor:pointer;color:var(--mui-color-text)">Right</button>
          <p style="margin:0;white-space:nowrap;color:var(--mui-color-text)">Placement: right</p>
        </mui-popover>

        <div></div>
        <mui-popover placement="bottom">
          <button muiPopoverTrigger style="padding:8px 16px;border:1px solid var(--mui-color-border);border-radius:8px;background:var(--mui-color-surface);cursor:pointer;color:var(--mui-color-text)">Bottom</button>
          <p style="margin:0;white-space:nowrap;color:var(--mui-color-text)">Placement: bottom</p>
        </mui-popover>
        <div></div>
      </div>
    `,
  }),
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <mui-popover placement="bottom-start" heading="More info" [open]="true">
        <button muiPopoverTrigger style="padding:8px 16px;border:1px solid var(--mui-color-border);border-radius:8px;background:var(--mui-color-surface);cursor:pointer;color:var(--mui-color-text)">
          Info
        </button>
        <p style="margin:0;color:var(--mui-color-text)">
          aria-expanded on trigger, role=dialog on panel, aria-labelledby links to heading.
        </p>
      </mui-popover>
    `,
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    template: `
      <div style="width:375px;padding:40px;display:flex;justify-content:center;">
        <mui-popover placement="bottom">
          <button muiPopoverTrigger style="padding:12px 20px;border:1px solid var(--mui-color-border);border-radius:8px;background:var(--mui-color-primary);cursor:pointer;color:#fff">
            More options
          </button>
          <div style="display:flex;flex-direction:column;gap:8px;min-width:180px;">
            <p style="margin:0;color:var(--mui-color-text)">Edit</p>
            <p style="margin:0;color:var(--mui-color-text)">Duplicate</p>
            <p style="margin:0;color:var(--mui-color-danger)">Delete</p>
          </div>
        </mui-popover>
      </div>
    `,
  }),
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
