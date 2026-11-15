import type { Meta, StoryObj } from '@storybook/angular';
import { NavLink } from '../nav-link/nav-link';
import { SiteHeader } from './site-header';

const meta: Meta<SiteHeader> = {
  title: 'Navigation/SiteHeader',
  component: SiteHeader,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    menuLabel: { control: 'text' },
    navLabel: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<SiteHeader>;

const TEMPLATE = `
  <mui-site-header [menuLabel]="menuLabel" [navLabel]="navLabel">
    <a slot="brand" href="#home" style="font-weight:600;text-decoration:none;color:inherit;">Loom</a>
    <a muiNavLink href="#blog" [active]="true">Blog</a>
    <a muiNavLink href="#tags">Tags</a>
    <a muiNavLink href="#about">About</a>
  </mui-site-header>
`;

export const Default: Story = {
  args: { menuLabel: 'Menu', navLabel: 'Main' },
  render: (args) => ({ props: args, template: TEMPLATE, imports: [SiteHeader, NavLink] }),
};

export const Hebrew: Story = {
  args: { menuLabel: 'תפריט', navLabel: 'ניווט ראשי' },
  render: (args) => ({
    props: args,
    template: `<div dir="rtl">${TEMPLATE}</div>`,
    imports: [SiteHeader, NavLink],
  }),
};

export const Accessibility: Story = {
  parameters: { a11y: { disable: false } },
  args: { menuLabel: 'Menu', navLabel: 'Main' },
  render: (args) => ({ props: args, template: TEMPLATE, imports: [SiteHeader, NavLink] }),
};

export const MobilePreview: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  args: { menuLabel: 'Menu', navLabel: 'Main' },
  render: (args) => ({ props: args, template: TEMPLATE, imports: [SiteHeader, NavLink] }),
};
