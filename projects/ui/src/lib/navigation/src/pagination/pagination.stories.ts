import type { Meta, StoryObj } from '@storybook/angular';
import { Pagination } from './pagination';

const meta: Meta<Pagination> = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    page: { control: { type: 'number', min: 1 } },
    totalPages: { control: { type: 'number', min: 1 } },
    siblingCount: { control: { type: 'number', min: 0 } },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'outline'] },
  },
};

export default meta;
type Story = StoryObj<Pagination>;

export const Default: Story = {
  args: { page: 1, totalPages: 10, size: 'md', variant: 'default' },
};

export const Middle: Story = {
  args: { page: 5, totalPages: 10 },
};

export const LastPage: Story = {
  args: { page: 10, totalPages: 10 },
};

export const FewPages: Story = {
  args: { page: 2, totalPages: 5 },
};

export const Outline: Story = {
  args: { page: 3, totalPages: 8, variant: 'outline' },
};

export const Sizes: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;align-items:flex-start;">
        <mui-pagination [totalPages]="7" [page]="3" size="sm"></mui-pagination>
        <mui-pagination [totalPages]="7" [page]="3" size="md"></mui-pagination>
        <mui-pagination [totalPages]="7" [page]="3" size="lg"></mui-pagination>
      </div>
    `,
    imports: [Pagination],
  }),
};

export const Accessibility: Story = {
  parameters: { a11y: { disable: false } },
  args: { page: 3, totalPages: 10, ariaLabel: 'Search results pages' },
};
