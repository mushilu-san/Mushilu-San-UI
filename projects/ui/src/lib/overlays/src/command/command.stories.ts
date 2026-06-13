import type { Meta, StoryObj } from '@storybook/angular';
import { Command } from './command';
import { CommandEmpty } from './command-empty';
import { CommandGroup } from './command-group';
import { CommandInput } from './command-input';
import { CommandItem } from './command-item';
import { CommandList } from './command-list';
import { CommandSeparator } from './command-separator';

const ALL = [
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
];

const meta: Meta = {
  title: 'Overlays/Command',
  component: Command,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    imports: ALL,
    template: `
      <div style="width:400px;">
        <mui-command>
          <mui-command-input placeholder="Search commands…" />
          <mui-command-list>
            <mui-command-group label="Files">
              <mui-command-item value="new file" shortcut="⌘N">New file</mui-command-item>
              <mui-command-item value="new folder">New folder</mui-command-item>
              <mui-command-item value="open file" shortcut="⌘O">Open file</mui-command-item>
            </mui-command-group>
            <mui-command-group label="Edit">
              <mui-command-item value="find replace" shortcut="⌘H">Find and replace</mui-command-item>
              <mui-command-item value="format document" shortcut="⇧⌥F">Format document</mui-command-item>
            </mui-command-group>
            <mui-command-separator />
            <mui-command-group label="Preferences">
              <mui-command-item value="settings" shortcut="⌘,">Settings</mui-command-item>
              <mui-command-item value="keyboard shortcuts" shortcut="⌘K">Keyboard shortcuts</mui-command-item>
            </mui-command-group>
          </mui-command-list>
        </mui-command>
      </div>
    `,
  }),
};

export const WithIcons: Story = {
  render: () => ({
    imports: ALL,
    template: `
      <div style="width:400px;">
        <mui-command>
          <mui-command-input placeholder="Search…" />
          <mui-command-list>
            <mui-command-item value="calendar">
              <svg slot="icon" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="1" y="2" width="14" height="13" rx="2"/><path d="M1 6h14M5 1v2M11 1v2"/></svg>
              Calendar
            </mui-command-item>
            <mui-command-item value="inbox">
              <svg slot="icon" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M14 10H2L1 14h14z"/><path d="M1 10V3a1 1 0 011-1h12a1 1 0 011 1v7"/><path d="M6 10a2 2 0 004 0"/></svg>
              Inbox
            </mui-command-item>
            <mui-command-item value="settings" shortcut="⌘,">
              <svg slot="icon" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="8" cy="8" r="2.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"/></svg>
              Settings
            </mui-command-item>
          </mui-command-list>
        </mui-command>
      </div>
    `,
  }),
};

export const WithDisabled: Story = {
  render: () => ({
    imports: ALL,
    template: `
      <div style="width:400px;">
        <mui-command>
          <mui-command-input placeholder="Search…" />
          <mui-command-list>
            <mui-command-item value="available">Available action</mui-command-item>
            <mui-command-item value="unavailable" [disabled]="true">Unavailable action</mui-command-item>
            <mui-command-item value="another">Another action</mui-command-item>
          </mui-command-list>
        </mui-command>
      </div>
    `,
  }),
};

export const Accessibility: Story = {
  render: () => ({
    imports: ALL,
    template: `
      <div style="width:400px;">
        <p style="margin:0 0 12px;font-family:var(--mui-font-sans);font-size:13px;color:var(--mui-color-text-muted);">
          Type to filter · ↑↓ to navigate · Enter to activate
        </p>
        <mui-command>
          <mui-command-input placeholder="Search commands…" />
          <mui-command-list>
            <mui-command-item value="profile">Profile</mui-command-item>
            <mui-command-item value="settings" shortcut="⌘,">Settings</mui-command-item>
            <mui-command-separator />
            <mui-command-item value="logout">Log out</mui-command-item>
          </mui-command-list>
        </mui-command>
      </div>
    `,
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    imports: ALL,
    template: `
      <div style="width:375px;padding:16px;">
        <mui-command>
          <mui-command-input placeholder="Search…" />
          <mui-command-list>
            <mui-command-item value="home">Home</mui-command-item>
            <mui-command-item value="profile">Profile</mui-command-item>
            <mui-command-item value="notifications">Notifications</mui-command-item>
            <mui-command-separator />
            <mui-command-item value="settings">Settings</mui-command-item>
          </mui-command-list>
        </mui-command>
      </div>
    `,
  }),
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
