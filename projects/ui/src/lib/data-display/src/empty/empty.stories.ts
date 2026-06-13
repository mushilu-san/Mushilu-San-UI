import type { Meta, StoryObj } from '@storybook/angular';
import { Empty } from './empty';

const meta: Meta<Empty> = {
  title: 'Data Display/Empty',
  component: Empty,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<Empty>;

const btnStyle = `padding:8px 16px;border:1px solid var(--mui-color-border);border-radius:8px;background:var(--mui-color-primary);color:var(--mui-color-primary-text);cursor:pointer;font-family:var(--mui-font-sans);`;

export const Default: Story = {
  render: () => ({
    imports: [Empty],
    template: `
      <mui-empty title="No results found" description="Try adjusting your search or filter to find what you are looking for.">
        <button slot="action" style="${btnStyle}">Clear filters</button>
      </mui-empty>
    `,
  }),
};

export const WithCustomIcon: Story = {
  render: () => ({
    imports: [Empty],
    template: `
      <mui-empty title="Your inbox is empty" description="When you receive messages, they will appear here.">
        <svg slot="icon" viewBox="0 0 48 48" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path d="M40 34H8a2 2 0 01-2-2V16l18-8 18 8v16a2 2 0 01-2 2z"/>
          <path d="M6 16l18 12 18-12"/>
        </svg>
      </mui-empty>
    `,
  }),
};

export const NoAction: Story = {
  render: () => ({
    imports: [Empty],
    template: `
      <mui-empty
        title="No notifications"
        description="You're all caught up! Check back later for new activity."
      />
    `,
  }),
};

export const WithMultipleActions: Story = {
  render: () => ({
    imports: [Empty],
    template: `
      <mui-empty title="No projects yet" description="Create your first project to get started.">
        <button slot="action" style="${btnStyle}">New project</button>
        <button slot="action" style="padding:8px 16px;border:1px solid var(--mui-color-border);border-radius:8px;background:var(--mui-color-surface-raised);color:var(--mui-color-text);cursor:pointer;font-family:var(--mui-font-sans);">Import</button>
      </mui-empty>
    `,
  }),
};

export const Accessibility: Story = {
  render: () => ({
    imports: [Empty],
    template: `
      <p style="font-family:var(--mui-font-sans);font-size:13px;color:var(--mui-color-text-muted);margin-bottom:16px;">
        Host has role="status" so screen readers announce the empty state.
      </p>
      <mui-empty title="No items found" description="This list is currently empty.">
        <button slot="action" style="${btnStyle}">Add item</button>
      </mui-empty>
    `,
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    imports: [Empty],
    template: `
      <div style="width:375px;padding:24px;">
        <mui-empty title="No messages" description="Start a conversation by sending your first message.">
          <button slot="action" style="width:100%;${btnStyle}">New message</button>
        </mui-empty>
      </div>
    `,
  }),
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
