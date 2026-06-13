import type { Meta, StoryObj } from '@storybook/angular';
import { Select } from './select';

const meta: Meta<Select> = {
  title: 'Forms/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outline', 'filled', 'ghost'] },
    invalid: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Select>;

const OPTIONS = `
  <option value="">Select a country…</option>
  <option value="us">United States</option>
  <option value="gb">United Kingdom</option>
  <option value="ca">Canada</option>
  <option value="au">Australia</option>
  <option value="de">Germany</option>
`;

export const Default: Story = {
  render: () => ({
    template: `<select muiSelect aria-label="Country" style="width:240px;">${OPTIONS}</select>`,
    imports: [Select],
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;width:240px;">
        <select muiSelect size="sm" aria-label="Small"><option>Small (32px)</option></select>
        <select muiSelect size="md" aria-label="Medium"><option>Medium (40px)</option></select>
        <select muiSelect size="lg" aria-label="Large"><option>Large (48px)</option></select>
      </div>
    `,
    imports: [Select],
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;width:240px;padding:16px;background:#f8fafc;border-radius:8px;">
        <select muiSelect variant="outline" aria-label="Outline"><option>Outline</option></select>
        <select muiSelect variant="filled"  aria-label="Filled"><option>Filled</option></select>
        <select muiSelect variant="ghost"   aria-label="Ghost"><option>Ghost</option></select>
      </div>
    `,
    imports: [Select],
  }),
};

export const Invalid: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:6px;width:240px;">
        <select muiSelect invalid aria-label="Country" aria-invalid="true" aria-describedby="sel-err">
          <option value="">Select a country…</option>
        </select>
        <p id="sel-err" role="alert" style="margin:0;font-size:12px;color:#dc2626;">Please select a country.</p>
      </div>
    `,
    imports: [Select],
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<select muiSelect disabled aria-label="Disabled" style="width:240px;"><option>Disabled option</option></select>`,
    imports: [Select],
  }),
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;width:280px;">
        <div style="display:flex;flex-direction:column;gap:4px;">
          <label for="sel-a1" style="font-size:14px;font-weight:500;">Country</label>
          <select muiSelect id="sel-a1">${OPTIONS}</select>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          <label for="sel-a2" style="font-size:14px;font-weight:500;">
            Region <span aria-hidden="true" style="color:#dc2626;">*</span>
          </label>
          <select muiSelect id="sel-a2" invalid aria-invalid="true" aria-required="true" aria-describedby="sel-a2-err">
            <option value="">Select a region…</option>
          </select>
          <p id="sel-a2-err" role="alert" style="margin:0;font-size:12px;color:#dc2626;">Region is required</p>
        </div>
      </div>
    `,
    imports: [Select],
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    template: `
      <div style="width:375px;padding:16px;display:flex;flex-direction:column;gap:12px;">
        <select muiSelect size="lg" aria-label="Country" style="width:100%;">${OPTIONS}</select>
        <select muiSelect size="lg" aria-label="Language" style="width:100%;">
          <option value="">Select language…</option>
          <option value="en">English</option>
          <option value="he">Hebrew</option>
          <option value="ar">Arabic</option>
        </select>
      </div>
    `,
    imports: [Select],
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
