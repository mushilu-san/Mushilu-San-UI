import type { Meta, StoryObj } from '@storybook/angular';
import { DatePicker } from './date-picker';

const meta: Meta<DatePicker> = {
  title: 'Forms/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    placeholder: { control: 'text' },
    minDate: { control: 'date' },
    maxDate: { control: 'date' },
    locale: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<DatePicker>;

export const Default: Story = {
  render: () => ({
    template: `<mui-date-picker [(value)]="date" />`,
    imports: [DatePicker],
    componentProperties: { date: null },
  }),
};

export const WithSelectedDate: Story = {
  render: () => ({
    template: `<mui-date-picker [(value)]="date" />`,
    imports: [DatePicker],
    componentProperties: { date: new Date(2024, 5, 15) },
  }),
};

export const WithMinMaxDate: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:8px;">
        <p style="margin:0;font-size:13px;color:#64748b;">
          Only dates 10–20 of the current month are selectable.
        </p>
        <mui-date-picker [(value)]="date" [minDate]="min" [maxDate]="max" />
      </div>
    `,
    imports: [DatePicker],
    componentProperties: {
      date: null,
      min: new Date(new Date().getFullYear(), new Date().getMonth(), 10),
      max: new Date(new Date().getFullYear(), new Date().getMonth(), 20),
    },
  }),
};

export const CustomPlaceholder: Story = {
  render: () => ({
    template: `<mui-date-picker placeholder="Select appointment date" [(value)]="date" />`,
    imports: [DatePicker],
    componentProperties: { date: null },
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<mui-date-picker [value]="date" [disabled]="true" />`,
    imports: [DatePicker],
    componentProperties: { date: new Date(2024, 5, 15) },
  }),
};

export const InAForm: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;width:320px;padding:20px;
                  background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
        <div style="display:flex;flex-direction:column;gap:6px;">
          <label for="dp-name" style="font-size:14px;font-weight:500;">Full name</label>
          <input id="dp-name" type="text" placeholder="John Smith"
            style="height:40px;padding:0 12px;border:1px solid #94a3b8;border-radius:8px;font-size:16px;" />
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;">
          <label style="font-size:14px;font-weight:500;">Date of birth</label>
          <mui-date-picker [(value)]="dob" placeholder="Select your birthdate" />
        </div>
        <button type="button"
          style="height:40px;background:#2563eb;color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer;">
          Submit
        </button>
      </div>
    `,
    imports: [DatePicker],
    componentProperties: { dob: null },
  }),
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:8px;">
        <label id="dp-label" style="font-size:14px;font-weight:500;">Appointment date</label>
        <mui-date-picker [(value)]="date" aria-labelledby="dp-label" />
        <p style="margin:0;font-size:13px;color:#64748b;">
          Use Tab to focus the trigger, Enter/Space to open, arrow keys to navigate
          the calendar, and Escape to close.
        </p>
      </div>
    `,
    imports: [DatePicker],
    componentProperties: { date: null },
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    template: `
      <div style="width:375px;padding:16px;display:flex;flex-direction:column;gap:12px;">
        <div style="display:flex;flex-direction:column;gap:6px;">
          <label style="font-size:14px;font-weight:500;">Check-in</label>
          <mui-date-picker [(value)]="checkin" style="width:100%;" />
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;">
          <label style="font-size:14px;font-weight:500;">Check-out</label>
          <mui-date-picker [(value)]="checkout" style="width:100%;" />
        </div>
      </div>
    `,
    imports: [DatePicker],
    componentProperties: { checkin: null, checkout: null },
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
