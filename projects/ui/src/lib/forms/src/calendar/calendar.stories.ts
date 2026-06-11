import type { Meta, StoryObj } from '@storybook/angular';
import { Calendar } from './calendar';

const meta: Meta<Calendar> = {
  title: 'Forms/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    minDate:  { control: 'date' },
    maxDate:  { control: 'date' },
    locale:   { control: 'text' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<Calendar>;

export const Default: Story = {
  render: () => ({
    template: `<mui-calendar [(value)]="date" />`,
    imports: [Calendar],
    componentProperties: { date: null },
  }),
};

export const WithSelectedDate: Story = {
  render: () => ({
    template: `<mui-calendar [(value)]="date" />`,
    imports: [Calendar],
    componentProperties: { date: new Date(2024, 5, 15) }, // June 15, 2024
  }),
};

export const WithMinMaxDate: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:8px;">
        <p style="margin:0;font-size:13px;color:#64748b;">
          Only dates 10–20 of the current month are selectable.
        </p>
        <mui-calendar [(value)]="date" [minDate]="min" [maxDate]="max" />
      </div>
    `,
    imports: [Calendar],
    componentProperties: {
      date: null,
      min: new Date(new Date().getFullYear(), new Date().getMonth(), 10),
      max: new Date(new Date().getFullYear(), new Date().getMonth(), 20),
    },
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<mui-calendar [value]="date" [disabled]="true" />`,
    imports: [Calendar],
    componentProperties: { date: new Date(2024, 5, 15) },
  }),
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:8px;">
        <p id="cal-desc" style="margin:0;font-size:14px;font-weight:500;">
          Select a date
        </p>
        <mui-calendar [(value)]="date" aria-describedby="cal-desc" />
        <p style="margin:0;font-size:13px;color:#64748b;">
          Selected: {{ date ? date.toLocaleDateString() : 'none' }}
        </p>
      </div>
    `,
    imports: [Calendar],
    componentProperties: { date: null },
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    template: `
      <div style="width:375px;padding:16px;">
        <mui-calendar [(value)]="date" style="width:100%;" />
        <p style="margin-top:8px;font-size:13px;color:#64748b;">
          Selected: {{ date ? date.toLocaleDateString() : 'none' }}
        </p>
      </div>
    `,
    imports: [Calendar],
    componentProperties: { date: null },
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
