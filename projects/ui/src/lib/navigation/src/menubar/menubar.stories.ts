import type { Meta, StoryObj } from '@storybook/angular';
import { Menubar } from './menubar';
import { MenubarMenu } from './menubar-menu';
import { MenubarTrigger } from './menubar-trigger';
import { MenubarContent } from './menubar-content';
import { MenubarItem } from './menubar-item';
import { MenubarSeparator } from './menubar-separator';

const IMPORTS = [
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
];

const meta: Meta = {
  title: 'Navigation/Menubar',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `
      <div style="padding:16px;background:var(--mui-color-surface);border:1px solid var(--mui-color-border);border-radius:8px;">
        <mui-menubar>
          <mui-menubar-menu>
            <button muiMenubarTrigger>File</button>
            <mui-menubar-content>
              <div muiMenubarItem>New File</div>
              <div muiMenubarItem>New Window</div>
              <mui-menubar-separator></mui-menubar-separator>
              <div muiMenubarItem>Open…</div>
              <div muiMenubarItem>Save</div>
              <div muiMenubarItem>Save As…</div>
              <mui-menubar-separator></mui-menubar-separator>
              <div muiMenubarItem>Exit</div>
            </mui-menubar-content>
          </mui-menubar-menu>
          <mui-menubar-menu>
            <button muiMenubarTrigger>Edit</button>
            <mui-menubar-content>
              <div muiMenubarItem>Undo</div>
              <div muiMenubarItem>Redo</div>
              <mui-menubar-separator></mui-menubar-separator>
              <div muiMenubarItem>Cut</div>
              <div muiMenubarItem>Copy</div>
              <div muiMenubarItem>Paste</div>
            </mui-menubar-content>
          </mui-menubar-menu>
          <mui-menubar-menu>
            <button muiMenubarTrigger>View</button>
            <mui-menubar-content>
              <div muiMenubarItem>Zoom In</div>
              <div muiMenubarItem>Zoom Out</div>
              <div muiMenubarItem>Reset Zoom</div>
              <mui-menubar-separator></mui-menubar-separator>
              <div muiMenubarItem>Toggle Fullscreen</div>
            </mui-menubar-content>
          </mui-menubar-menu>
          <mui-menubar-menu>
            <button muiMenubarTrigger>Help</button>
            <mui-menubar-content>
              <div muiMenubarItem>Documentation</div>
              <div muiMenubarItem>Keyboard Shortcuts</div>
              <mui-menubar-separator></mui-menubar-separator>
              <div muiMenubarItem>About</div>
            </mui-menubar-content>
          </mui-menubar-menu>
        </mui-menubar>
      </div>
    `,
    imports: IMPORTS,
  }),
};

export const WithDisabledItems: Story = {
  render: () => ({
    template: `
      <div style="padding:16px;background:var(--mui-color-surface);border:1px solid var(--mui-color-border);border-radius:8px;">
        <mui-menubar>
          <mui-menubar-menu>
            <button muiMenubarTrigger>File</button>
            <mui-menubar-content>
              <div muiMenubarItem>New</div>
              <div muiMenubarItem>Open…</div>
              <mui-menubar-separator></mui-menubar-separator>
              <div muiMenubarItem [disabled]="true">Save</div>
              <div muiMenubarItem [disabled]="true">Save As…</div>
            </mui-menubar-content>
          </mui-menubar-menu>
          <mui-menubar-menu>
            <button muiMenubarTrigger>Edit</button>
            <mui-menubar-content>
              <div muiMenubarItem [disabled]="true">Undo</div>
              <div muiMenubarItem [disabled]="true">Redo</div>
              <mui-menubar-separator></mui-menubar-separator>
              <div muiMenubarItem>Cut</div>
              <div muiMenubarItem>Copy</div>
              <div muiMenubarItem>Paste</div>
            </mui-menubar-content>
          </mui-menubar-menu>
        </mui-menubar>
        <p style="margin-top:8px;font-size:13px;color:var(--mui-color-text-muted);">
          Disabled items are excluded from keyboard navigation.
        </p>
      </div>
    `,
    imports: IMPORTS,
  }),
};

export const CustomLabel: Story = {
  render: () => ({
    template: `
      <div style="padding:16px;background:var(--mui-color-surface);border:1px solid var(--mui-color-border);border-radius:8px;">
        <mui-menubar label="Application menu">
          <mui-menubar-menu>
            <button muiMenubarTrigger>Application</button>
            <mui-menubar-content>
              <div muiMenubarItem>Preferences</div>
              <div muiMenubarItem>Settings</div>
              <mui-menubar-separator></mui-menubar-separator>
              <div muiMenubarItem>Quit</div>
            </mui-menubar-content>
          </mui-menubar-menu>
        </mui-menubar>
      </div>
    `,
    imports: IMPORTS,
  }),
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="padding:16px;background:var(--mui-color-surface);border:1px solid var(--mui-color-border);border-radius:8px;">
        <mui-menubar label="Main application menu bar">
          <mui-menubar-menu>
            <button muiMenubarTrigger>File</button>
            <mui-menubar-content>
              <div muiMenubarItem>New</div>
              <div muiMenubarItem>Open…</div>
              <mui-menubar-separator></mui-menubar-separator>
              <div muiMenubarItem [disabled]="true">Save</div>
              <div muiMenubarItem>Save As…</div>
            </mui-menubar-content>
          </mui-menubar-menu>
          <mui-menubar-menu>
            <button muiMenubarTrigger>Edit</button>
            <mui-menubar-content>
              <div muiMenubarItem>Cut</div>
              <div muiMenubarItem>Copy</div>
              <div muiMenubarItem>Paste</div>
            </mui-menubar-content>
          </mui-menubar-menu>
        </mui-menubar>
        <p style="margin-top:8px;font-size:13px;color:var(--mui-color-text-muted);">
          role=menubar on root · role=menuitem on triggers · role=menu on content ·
          ArrowLeft/Right navigate between menus · ArrowDown opens a menu · ArrowDown/Up navigate items ·
          Home/End jump to first/last item · Escape closes.
        </p>
      </div>
    `,
    imports: IMPORTS,
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    template: `
      <div style="width:375px;padding:16px;background:var(--mui-color-surface);
        border:1px solid var(--mui-color-border);border-radius:8px;overflow-x:auto;">
        <mui-menubar style="flex-wrap:nowrap;">
          <mui-menubar-menu>
            <button muiMenubarTrigger>File</button>
            <mui-menubar-content>
              <div muiMenubarItem>New</div>
              <div muiMenubarItem>Open…</div>
              <div muiMenubarItem>Save</div>
            </mui-menubar-content>
          </mui-menubar-menu>
          <mui-menubar-menu>
            <button muiMenubarTrigger>Edit</button>
            <mui-menubar-content>
              <div muiMenubarItem>Cut</div>
              <div muiMenubarItem>Copy</div>
              <div muiMenubarItem>Paste</div>
            </mui-menubar-content>
          </mui-menubar-menu>
        </mui-menubar>
      </div>
    `,
    imports: IMPORTS,
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
