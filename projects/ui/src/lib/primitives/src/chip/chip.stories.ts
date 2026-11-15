import type { Meta, StoryObj } from '@storybook/angular';
import { Chip } from './chip';

const meta: Meta<Chip> = {
  title: 'Primitives/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    selected: { control: 'boolean' },
    leading: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<Chip>;

export const Default: Story = {
  args: { selected: false, leading: '#' },
  render: (args) => ({
    props: args,
    template: `<a muiChip href="#angular" [selected]="selected" [leading]="leading">angular</a>`,
    imports: [Chip],
  }),
};

export const TagList: Story = {
  render: () => ({
    props: {},
    template: `
      <ul style="display:flex;gap:8px;list-style:none;margin:0;padding:0;" aria-label="Tags">
        <li><a muiChip href="#a" leading="#" selected>angular</a></li>
        <li><a muiChip href="#b" leading="#">signals</a></li>
        <li><a muiChip href="#c" leading="#">rtl</a></li>
      </ul>`,
    imports: [Chip],
  }),
};

export const Toggle: Story = {
  render: () => ({
    props: { on: true },
    template: `<button muiChip [selected]="on" (click)="on = !on">Filter</button>`,
    imports: [Chip],
  }),
};

export const Static: Story = {
  render: () => ({
    props: {},
    template: `<mui-chip leading="#">read-only</mui-chip>`,
    imports: [Chip],
  }),
};

export const Accessibility: Story = {
  parameters: { a11y: { disable: false } },
  render: () => ({
    props: { on: false },
    template: `
      <nav aria-label="Tags">
        <a muiChip href="#a" leading="#" selected>angular</a>
        <a muiChip href="#b" leading="#">signals</a>
      </nav>
      <button muiChip [selected]="on" (click)="on = !on">Only drafts</button>`,
    imports: [Chip],
  }),
};

export const MobilePreview: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    props: {},
    template: `<a muiChip href="#a" leading="#">angular</a> <a muiChip href="#b" leading="#">signals</a>`,
    imports: [Chip],
  }),
};
