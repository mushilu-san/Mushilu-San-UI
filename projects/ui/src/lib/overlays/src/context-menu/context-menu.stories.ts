import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ContextMenu } from './context-menu';
import { ContextMenuItem } from './context-menu-item';
import { ContextMenuSeparator } from './context-menu-separator';
import { ContextMenuTrigger } from './context-menu-trigger';

const ALL = [ContextMenu, ContextMenuTrigger, ContextMenuItem, ContextMenuSeparator];

const meta: Meta = {
  title: 'Overlays/ContextMenu',
  component: ContextMenu,
  decorators: [moduleMetadata({ imports: ALL })],
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

const areaStyle = `display:flex;align-items:center;justify-content:center;width:320px;height:160px;border:2px dashed var(--mui-color-border);border-radius:var(--mui-radius-md);color:var(--mui-color-text-muted);font-family:var(--mui-font-sans);font-size:14px;user-select:none;`;

export const Default: Story = {
  render: () => ({
    template: `
      <button type="button" style="margin-bottom:12px;">Focus me first</button>
      <mui-context-menu>
        <div muiContextMenuTrigger style="${areaStyle}">Right-click here</div>
        <mui-context-menu-item>View</mui-context-menu-item>
        <mui-context-menu-item shortcut="⌘E">Edit</mui-context-menu-item>
        <mui-context-menu-item shortcut="⌘D">Duplicate</mui-context-menu-item>
        <mui-context-menu-separator />
        <mui-context-menu-item color="danger" shortcut="⌘⌫">Delete</mui-context-menu-item>
      </mui-context-menu>
    `,
  }),
};

export const WithIcons: Story = {
  render: () => ({
    template: `
      <mui-context-menu>
        <div muiContextMenuTrigger style="${areaStyle}">Right-click here</div>
        <mui-context-menu-item>
          <svg slot="icon" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M11 2H5a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2z"/></svg>
          Open
        </mui-context-menu-item>
        <mui-context-menu-item shortcut="⌘C">
          <svg slot="icon" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="2" y="5" width="9" height="9" rx="1"/><path d="M5 5V4a2 2 0 012-2h5a2 2 0 012 2v7a2 2 0 01-2 2h-1"/></svg>
          Copy
        </mui-context-menu-item>
        <mui-context-menu-separator />
        <mui-context-menu-item color="danger">
          <svg slot="icon" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M10 8v4M6 8v4M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9"/></svg>
          Delete
        </mui-context-menu-item>
      </mui-context-menu>
    `,
  }),
};

export const WithDisabledItem: Story = {
  render: () => ({
    template: `
      <mui-context-menu>
        <div muiContextMenuTrigger style="${areaStyle}">Right-click here</div>
        <mui-context-menu-item>Edit</mui-context-menu-item>
        <mui-context-menu-item [disabled]="true">Paste (no clipboard)</mui-context-menu-item>
        <mui-context-menu-separator />
        <mui-context-menu-item color="danger">Delete</mui-context-menu-item>
      </mui-context-menu>
    `,
  }),
};

export const Accessibility: Story = {
  render: () => ({
    props: { isOpen: true },
    template: `
      <mui-context-menu [(open)]="isOpen">
        <div muiContextMenuTrigger style="${areaStyle}">Right-click to open</div>
        <mui-context-menu-item>Edit</mui-context-menu-item>
        <mui-context-menu-item>Duplicate</mui-context-menu-item>
        <mui-context-menu-separator />
        <mui-context-menu-item color="danger">Delete</mui-context-menu-item>
      </mui-context-menu>
      <p style="margin-top:200px;font-size:13px;color:var(--mui-color-text-muted);font-family:sans-serif;">
        panel role="menu" · items role="menuitem" · Escape closes
      </p>
    `,
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    template: `
      <div style="width:375px;padding:24px;">
        <p style="font-family:var(--mui-font-sans);font-size:13px;color:var(--mui-color-text-muted);margin:0 0 12px;">Long-press on mobile to open</p>
        <mui-context-menu>
          <div muiContextMenuTrigger style="${areaStyle}">Long-press here</div>
          <mui-context-menu-item>Share</mui-context-menu-item>
          <mui-context-menu-item>Copy link</mui-context-menu-item>
          <mui-context-menu-separator />
          <mui-context-menu-item color="danger">Remove</mui-context-menu-item>
        </mui-context-menu>
      </div>
    `,
  }),
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
