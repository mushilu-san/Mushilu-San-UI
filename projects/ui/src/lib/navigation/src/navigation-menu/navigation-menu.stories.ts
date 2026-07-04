import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { NavigationMenu } from './navigation-menu';
import { NavigationMenuItem } from './navigation-menu-item';
import { NavigationMenuTrigger } from './navigation-menu-trigger';
import { NavigationMenuContent } from './navigation-menu-content';
import { NavigationMenuLink } from './navigation-menu-link';

const ALL = [
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
];

const meta: Meta = {
  title: 'Navigation/NavigationMenu',
  component: NavigationMenu,
  decorators: [moduleMetadata({ imports: ALL })],
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `
      <div style="padding:16px;background:var(--mui-color-surface);border:1px solid var(--mui-color-border);border-radius:8px;">
        <mui-navigation-menu>
          <mui-navigation-menu-item>
            <button muiNavMenuTrigger>Getting started</button>
            <mui-navigation-menu-content>
              <div style="display:flex;flex-direction:column;gap:4px;">
                <a muiNavMenuLink href="#" [active]="true">Introduction</a>
                <a muiNavMenuLink href="#">Installation</a>
                <a muiNavMenuLink href="#">Quick start</a>
              </div>
            </mui-navigation-menu-content>
          </mui-navigation-menu-item>
          <mui-navigation-menu-item>
            <button muiNavMenuTrigger>Components</button>
            <mui-navigation-menu-content>
              <div style="display:flex;flex-direction:column;gap:4px;">
                <a muiNavMenuLink href="#">Button</a>
                <a muiNavMenuLink href="#">Input</a>
                <a muiNavMenuLink href="#">Dialog</a>
              </div>
            </mui-navigation-menu-content>
          </mui-navigation-menu-item>
          <a muiNavMenuLink href="#">Documentation</a>
          <a muiNavMenuLink href="#">GitHub</a>
        </mui-navigation-menu>
      </div>
    `,
  }),
};

export const WithRichContent: Story = {
  render: () => ({
    template: `
      <div style="padding:16px;background:var(--mui-color-surface);border:1px solid var(--mui-color-border);border-radius:8px;">
        <mui-navigation-menu>
          <mui-navigation-menu-item>
            <button muiNavMenuTrigger>Products</button>
            <mui-navigation-menu-content style="--_content-width:360px;min-width:360px;">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                <a muiNavMenuLink href="#"
                  style="flex-direction:column;align-items:flex-start;padding:12px;border-radius:6px;
                    background:var(--mui-color-surface-raised);">
                  <strong style="font-size:13px;color:var(--mui-color-text);margin-bottom:4px;">Analytics</strong>
                  <span style="font-size:12px;color:var(--mui-color-text-muted);">Insights dashboard</span>
                </a>
                <a muiNavMenuLink href="#"
                  style="flex-direction:column;align-items:flex-start;padding:12px;border-radius:6px;
                    background:var(--mui-color-surface-raised);">
                  <strong style="font-size:13px;color:var(--mui-color-text);margin-bottom:4px;">Storage</strong>
                  <span style="font-size:12px;color:var(--mui-color-text-muted);">File management</span>
                </a>
              </div>
            </mui-navigation-menu-content>
          </mui-navigation-menu-item>
          <a muiNavMenuLink href="#">Pricing</a>
          <a muiNavMenuLink href="#">Blog</a>
        </mui-navigation-menu>
      </div>
    `,
  }),
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="padding:16px;background:var(--mui-color-surface);border:1px solid var(--mui-color-border);border-radius:8px;">
        <mui-navigation-menu label="Primary site navigation">
          <mui-navigation-menu-item>
            <button muiNavMenuTrigger>Menu with dropdown</button>
            <mui-navigation-menu-content>
              <nav aria-label="Menu links">
                <ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px;">
                  <li><a muiNavMenuLink href="#" [active]="true">Current page</a></li>
                  <li><a muiNavMenuLink href="#">Other page</a></li>
                </ul>
              </nav>
            </mui-navigation-menu-content>
          </mui-navigation-menu-item>
          <a muiNavMenuLink href="#">Plain link</a>
        </mui-navigation-menu>
        <p style="margin-top:8px;font-size:13px;color:var(--mui-color-text-muted);">
          Tab to trigger, Enter/Space to open, Escape to close. Links inside are keyboard reachable.
        </p>
      </div>
    `,
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    template: `
      <div style="width:375px;padding:16px;background:var(--mui-color-surface);
        border:1px solid var(--mui-color-border);border-radius:8px;">
        <mui-navigation-menu style="flex-wrap:wrap;gap:4px;">
          <mui-navigation-menu-item>
            <button muiNavMenuTrigger>Menu</button>
            <mui-navigation-menu-content>
              <div style="display:flex;flex-direction:column;gap:4px;">
                <a muiNavMenuLink href="#" [active]="true">Home</a>
                <a muiNavMenuLink href="#">Products</a>
                <a muiNavMenuLink href="#">About</a>
              </div>
            </mui-navigation-menu-content>
          </mui-navigation-menu-item>
          <a muiNavMenuLink href="#">Contact</a>
        </mui-navigation-menu>
      </div>
    `,
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
