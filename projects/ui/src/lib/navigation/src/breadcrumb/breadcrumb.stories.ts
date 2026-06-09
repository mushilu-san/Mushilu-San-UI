import type { Meta, StoryObj } from '@storybook/angular';
import { Breadcrumb } from './breadcrumb';

const meta: Meta<Breadcrumb> = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    separator: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<Breadcrumb>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Shoes' },
    ],
    separator: '/',
  },
};

export const TwoLevels: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Settings' },
    ],
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ label: 'Dashboard' }],
  },
};

export const CustomSeparator: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Library', href: '/library' },
      { label: 'Data' },
    ],
    separator: '›',
  },
};

export const Accessibility: Story = {
  parameters: { a11y: { disable: false } },
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Running Shoes' },
    ],
    separator: '/',
  },
};
