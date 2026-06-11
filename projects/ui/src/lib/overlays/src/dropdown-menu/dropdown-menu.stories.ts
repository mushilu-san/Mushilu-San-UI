import type { Meta, StoryObj } from '@storybook/angular';
import { DropdownItem } from './dropdown-item';
import { DropdownMenu } from './dropdown-menu';
import { DropdownSeparator } from './dropdown-separator';
import { DropdownTrigger } from './dropdown-trigger';

const triggerStyle = `padding:8px 14px;border:1px solid var(--mui-color-border);border-radius:8px;background:var(--mui-color-surface-raised);cursor:pointer;color:var(--mui-color-text);font-family:var(--mui-font-sans);display:inline-flex;align-items:center;gap:6px;`;

const meta: Meta = {
  title: 'Overlays/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    imports: [DropdownMenu, DropdownTrigger, DropdownItem, DropdownSeparator],
    template: `
      <mui-dropdown-menu>
        <button muiDropdownTrigger style="${triggerStyle}">
          Options
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 11L3 6h10z"/></svg>
        </button>
        <mui-dropdown-item>View profile</mui-dropdown-item>
        <mui-dropdown-item>Edit</mui-dropdown-item>
        <mui-dropdown-item shortcut="⌘D">Duplicate</mui-dropdown-item>
        <mui-dropdown-separator />
        <mui-dropdown-item color="danger">Delete</mui-dropdown-item>
      </mui-dropdown-menu>
    `,
  }),
};

export const WithIcons: Story = {
  render: () => ({
    imports: [DropdownMenu, DropdownTrigger, DropdownItem, DropdownSeparator],
    template: `
      <mui-dropdown-menu>
        <button muiDropdownTrigger style="${triggerStyle}">Actions</button>
        <mui-dropdown-item [hasIcon]="true">
          <svg slot="icon" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M11 2H5a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2z"/><path d="M9 2v4H7V2"/></svg>
          Save
        </mui-dropdown-item>
        <mui-dropdown-item [hasIcon]="true" shortcut="⌘C">
          <svg slot="icon" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="2" y="5" width="9" height="9" rx="1"/><path d="M5 5V4a2 2 0 012-2h5a2 2 0 012 2v7a2 2 0 01-2 2h-1"/></svg>
          Copy
        </mui-dropdown-item>
        <mui-dropdown-separator />
        <mui-dropdown-item [hasIcon]="true" color="danger">
          <svg slot="icon" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M10 8v4M6 8v4M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9"/></svg>
          Delete
        </mui-dropdown-item>
      </mui-dropdown-menu>
    `,
  }),
};

export const WithDisabledItem: Story = {
  render: () => ({
    imports: [DropdownMenu, DropdownTrigger, DropdownItem, DropdownSeparator],
    template: `
      <mui-dropdown-menu>
        <button muiDropdownTrigger style="${triggerStyle}">File</button>
        <mui-dropdown-item>New file</mui-dropdown-item>
        <mui-dropdown-item disabled>Open recent</mui-dropdown-item>
        <mui-dropdown-separator />
        <mui-dropdown-item shortcut="⌘S">Save</mui-dropdown-item>
      </mui-dropdown-menu>
    `,
  }),
};

export const Accessibility: Story = {
  render: () => ({
    imports: [DropdownMenu, DropdownTrigger, DropdownItem, DropdownSeparator],
    props: { isOpen: true },
    template: `
      <mui-dropdown-menu [(open)]="isOpen">
        <button muiDropdownTrigger style="${triggerStyle}">Options</button>
        <mui-dropdown-item>Edit</mui-dropdown-item>
        <mui-dropdown-item>Duplicate</mui-dropdown-item>
        <mui-dropdown-separator />
        <mui-dropdown-item color="danger">Delete</mui-dropdown-item>
      </mui-dropdown-menu>
      <p style="margin-top:24px;font-size:13px;color:var(--mui-color-text-muted);font-family:sans-serif;">
        ↑↓ to navigate items · Escape to close · Tab closes and moves focus
      </p>
    `,
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    imports: [DropdownMenu, DropdownTrigger, DropdownItem, DropdownSeparator],
    template: `
      <div style="width:375px;padding:40px;display:flex;justify-content:flex-start;">
        <mui-dropdown-menu>
          <button muiDropdownTrigger style="${triggerStyle}">More</button>
          <mui-dropdown-item>Share</mui-dropdown-item>
          <mui-dropdown-item>Copy link</mui-dropdown-item>
          <mui-dropdown-separator />
          <mui-dropdown-item color="danger">Remove</mui-dropdown-item>
        </mui-dropdown-menu>
      </div>
    `,
  }),
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
