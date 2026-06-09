import type { Meta, StoryObj } from '@storybook/angular';
import { NavLink } from './nav-link';

const meta: Meta<NavLink> = {
  title: 'Navigation/NavLink',
  component: NavLink,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'primary'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    active: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<NavLink>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<a muiNavLink [variant]="variant" [size]="size" [active]="active" href="#">Dashboard</a>`,
    imports: [NavLink],
  }),
  args: { variant: 'default', size: 'md', active: false },
};

export const Active: Story = {
  render: () => ({
    props: {},
    template: `<a muiNavLink active href="#">Active Page</a>`,
    imports: [NavLink],
  }),
};

export const NavBar: Story = {
  render: () => ({
    props: {},
    template: `
      <nav style="display:flex;gap:4px;">
        <a muiNavLink active href="#">Dashboard</a>
        <a muiNavLink href="#">Products</a>
        <a muiNavLink href="#">Orders</a>
        <a muiNavLink href="#">Settings</a>
      </nav>
    `,
    imports: [NavLink],
  }),
};

export const Sizes: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;align-items:center;gap:8px;">
        <a muiNavLink size="sm" active href="#">Small</a>
        <a muiNavLink size="md" active href="#">Medium</a>
        <a muiNavLink size="lg" active href="#">Large</a>
      </div>
    `,
    imports: [NavLink],
  }),
};

export const Accessibility: Story = {
  parameters: { a11y: { disable: false } },
  render: () => ({
    props: {},
    template: `
      <nav aria-label="Main navigation">
        <a muiNavLink active href="#" aria-current="page">Home</a>
        <a muiNavLink href="#">About</a>
        <a muiNavLink href="#">Contact</a>
      </nav>
    `,
    imports: [NavLink],
  }),
};
