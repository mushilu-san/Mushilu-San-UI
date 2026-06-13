import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { Table } from './table';
import type { TableColumn } from './table.types';

const COLUMNS: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'joined', label: 'Joined', sortable: true },
];

const ROWS = [
  { name: 'Alice Chen', email: 'alice@example.com', role: 'Admin', joined: '2023-01-10' },
  { name: 'Bob Martinez', email: 'bob@example.com', role: 'User', joined: '2023-03-22' },
  { name: 'Carol Smith', email: 'carol@example.com', role: 'Editor', joined: '2022-11-05' },
  { name: 'Dan Park', email: 'dan@example.com', role: 'User', joined: '2024-02-18' },
];

const meta: Meta<Table> = {
  title: 'Data Display/Table',
  component: Table,
  tags: ['autodocs'],
  args: { sortChange: fn() },
};
export default meta;
type Story = StoryObj<Table>;

export const Default: Story = {
  args: {
    columns: COLUMNS,
    rows: ROWS,
  },
};

export const WithCaption: Story = {
  args: {
    columns: COLUMNS,
    rows: ROWS,
    caption: 'Team members',
  },
};

export const SortableOnly: Story = {
  args: {
    columns: [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'score', label: 'Score', sortable: true },
    ],
    rows: [
      { name: 'Alice', score: 95 },
      { name: 'Bob', score: 82 },
      { name: 'Carol', score: 88 },
    ],
    caption: 'Leaderboard',
  },
};

export const StickyHeader: Story = {
  args: {
    columns: COLUMNS,
    rows: [
      ...ROWS,
      { name: 'Eve Turner', email: 'eve@example.com', role: 'User', joined: '2024-04-01' },
      { name: 'Frank Lee', email: 'frank@example.com', role: 'User', joined: '2024-05-15' },
      { name: 'Grace Kim', email: 'grace@example.com', role: 'Admin', joined: '2021-09-30' },
    ],
    caption: 'Scrollable with sticky header',
    stickyHeader: true,
  },
  render: (args) => ({
    props: args,
    template: `<mui-table
      style="max-height: 200px; overflow-y: auto;"
      [columns]="columns"
      [rows]="rows"
      [caption]="caption"
      [stickyHeader]="stickyHeader"
      (sortChange)="sortChange($event)"
    ></mui-table>`,
  }),
};

export const Accessibility: Story = {
  parameters: { a11y: { disable: false } },
  args: {
    columns: COLUMNS,
    rows: ROWS,
    caption: 'Team members',
  },
};

export const MobilePreview: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  args: {
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role', sortable: true },
    ],
    rows: ROWS.slice(0, 3),
    caption: 'Team',
  },
};
