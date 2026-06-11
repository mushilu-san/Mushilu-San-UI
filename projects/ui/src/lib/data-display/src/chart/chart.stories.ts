import type { Meta, StoryObj } from '@storybook/angular';
import { Chart } from './chart';

const meta: Meta<Chart> = {
  title: 'Data Display/Chart',
  component: Chart,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['bar', 'line', 'pie', 'doughnut', 'radar', 'polarArea'],
    },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<Chart>;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export const BarChart: Story = {
  args: {
    type: 'bar',
    label: 'Monthly Revenue',
    data: {
      labels: MONTHS,
      datasets: [
        {
          label: 'Revenue',
          data: [12000, 19000, 8000, 15000, 21000, 17000],
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
          borderRadius: 4,
        },
      ],
    },
  },
};

export const LineChart: Story = {
  args: {
    type: 'line',
    label: 'Weekly Active Users',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Users',
          data: [1200, 1900, 1500, 2100, 1800, 900, 700],
          borderColor: 'rgba(99, 102, 241, 1)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    },
  },
};

export const PieChart: Story = {
  args: {
    type: 'pie',
    label: 'Traffic Sources',
    data: {
      labels: ['Organic', 'Direct', 'Referral', 'Social'],
      datasets: [
        {
          data: [40, 25, 20, 15],
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
        },
      ],
    },
  },
};

export const MultiDataset: Story = {
  args: {
    type: 'bar',
    label: 'Revenue vs Expenses',
    data: {
      labels: MONTHS,
      datasets: [
        {
          label: 'Revenue',
          data: [12000, 19000, 8000, 15000, 21000, 17000],
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
          borderRadius: 4,
        },
        {
          label: 'Expenses',
          data: [8000, 12000, 6000, 9000, 14000, 11000],
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderRadius: 4,
        },
      ],
    },
    options: {
      plugins: { legend: { position: 'top' } },
      scales: { y: { beginAtZero: true } },
    },
  },
};

export const Accessibility: Story = {
  parameters: { a11y: { disable: false } },
  args: {
    type: 'bar',
    label: 'Quarterly Sales — Q1 through Q4',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Sales (USD)',
          data: [45000, 62000, 58000, 71000],
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
          borderRadius: 4,
        },
      ],
    },
  },
};

export const MobilePreview: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  args: {
    type: 'line',
    label: 'Daily Steps',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Steps',
          data: [6200, 8400, 5100, 9300, 7800, 11200, 4500],
          borderColor: 'rgba(16, 185, 129, 1)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    },
  },
};
