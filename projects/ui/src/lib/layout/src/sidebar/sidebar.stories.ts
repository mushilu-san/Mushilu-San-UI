import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { Sidebar } from './sidebar';
import { SidebarSection } from './sidebar-section';
import { SidebarItem } from './sidebar-item';
import { SidebarTrigger } from './sidebar-trigger';

const IMPORTS = [Sidebar, SidebarSection, SidebarItem, SidebarTrigger];

// `component` + `moduleMetadata` (rather than per-story `imports:`) is required for
// multi-component groups to actually compile in the production Storybook build — see
// Command/CommandItem for the established pattern. Without it, the story's template
// string is inserted as static, uncompiled markup (host bindings never apply).
const meta: Meta = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  decorators: [moduleMetadata({ imports: IMPORTS })],
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `
      <div style="display:flex;height:100vh;">
        <mui-sidebar>
          <div style="padding:var(--mui-space-2);display:flex;justify-content:flex-end;">
            <button muiSidebarTrigger></button>
          </div>
          <mui-sidebar-section label="Main">
            <a muiSidebarItem label="Dashboard" [active]="true" href="#">
              <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
            </a>
            <a muiSidebarItem label="Analytics" href="#">
              <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </a>
            <a muiSidebarItem label="Projects" href="#">
              <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </a>
          </mui-sidebar-section>
          <mui-sidebar-section label="Settings">
            <a muiSidebarItem label="Profile" href="#">
              <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </a>
            <a muiSidebarItem label="Settings" href="#">
              <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                <path d="M4.93 4.93a10 10 0 0 0 0 14.14"/>
              </svg>
            </a>
          </mui-sidebar-section>
        </mui-sidebar>
        <main style="flex:1;padding:24px;background:var(--mui-color-bg);">
          <h1 style="margin:0 0 8px;font-size:24px;">Dashboard</h1>
          <p style="margin:0;color:var(--mui-color-text-muted);">Use the sidebar trigger to collapse/expand.</p>
        </main>
      </div>
    `,
  }),
};

export const Collapsed: Story = {
  render: () => ({
    template: `
      <div style="display:flex;height:400px;">
        <mui-sidebar [(expanded)]="expanded">
          <div style="padding:var(--mui-space-2);display:flex;justify-content:center;">
            <button muiSidebarTrigger></button>
          </div>
          <mui-sidebar-section label="Main">
            <a muiSidebarItem label="Dashboard" [active]="true" href="#">
              <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
            </a>
            <a muiSidebarItem label="Analytics" href="#">
              <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </a>
          </mui-sidebar-section>
        </mui-sidebar>
        <main style="flex:1;padding:24px;">Content area</main>
      </div>
    `,
    componentProperties: { expanded: false },
  }),
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="display:flex;height:400px;">
        <mui-sidebar label="Primary navigation">
          <div style="padding:var(--mui-space-2);display:flex;justify-content:flex-end;">
            <button muiSidebarTrigger></button>
          </div>
          <mui-sidebar-section label="Navigation">
            <a muiSidebarItem label="Home" [active]="true" href="#"
              aria-description="You are currently on the Home page">
              <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </a>
            <a muiSidebarItem label="Settings" href="#">
              <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </a>
          </mui-sidebar-section>
        </mui-sidebar>
        <main style="flex:1;padding:24px;">
          <h1 style="margin:0;">Home</h1>
        </main>
      </div>
    `,
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    template: `
      <div style="width:375px;height:667px;display:flex;overflow:hidden;">
        <mui-sidebar [(expanded)]="expanded" style="--_sidebar-width:200px;">
          <div style="padding:var(--mui-space-2);display:flex;justify-content:flex-end;">
            <button muiSidebarTrigger></button>
          </div>
          <mui-sidebar-section label="Menu">
            <a muiSidebarItem label="Home" [active]="true" href="#">
              <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </a>
            <a muiSidebarItem label="Profile" href="#">
              <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </a>
          </mui-sidebar-section>
        </mui-sidebar>
        <main style="flex:1;padding:16px;background:var(--mui-color-bg);overflow:hidden;">
          <p style="margin:0;font-size:14px;">Main content</p>
        </main>
      </div>
    `,
    componentProperties: { expanded: true },
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
