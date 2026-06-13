import type { Meta, StoryObj } from '@storybook/angular';
import { Checkbox } from './checkbox';

const meta: Meta<Checkbox> = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    invalid: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Checkbox>;

export const Default: Story = {
  render: () => ({
    template: `
      <label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;">
        <input type="checkbox" muiCheckbox />
        Accept terms and conditions
      </label>
    `,
    imports: [Checkbox],
  }),
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;">
          <input type="checkbox" muiCheckbox />
          Unchecked
        </label>
        <label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;">
          <input type="checkbox" muiCheckbox checked />
          Checked
        </label>
        <label style="display:inline-flex;align-items:center;gap:8px;font-size:14px;color:#94a3b8;cursor:not-allowed;">
          <input type="checkbox" muiCheckbox disabled />
          Disabled unchecked
        </label>
        <label style="display:inline-flex;align-items:center;gap:8px;font-size:14px;color:#94a3b8;cursor:not-allowed;">
          <input type="checkbox" muiCheckbox checked disabled />
          Disabled checked
        </label>
      </div>
    `,
    imports: [Checkbox],
  }),
};

export const Indeterminate: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;font-weight:500;">
          <input type="checkbox" muiCheckbox #parent
            (change)="children.forEach(c => c.checked = parent.checked)"
            style="cursor:pointer;" />
          Select all
        </label>
        <div style="margin-left:24px;display:flex;flex-direction:column;gap:8px;">
          <label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;">
            <input type="checkbox" muiCheckbox #children checked />
            Option A
          </label>
          <label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;">
            <input type="checkbox" muiCheckbox #children />
            Option B
          </label>
        </div>
      </div>
    `,
    imports: [Checkbox],
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:center;gap:20px;">
        <label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-size:14px;">
          <input type="checkbox" muiCheckbox size="sm" checked />
          sm
        </label>
        <label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-size:14px;">
          <input type="checkbox" muiCheckbox size="md" checked />
          md
        </label>
        <label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-size:14px;">
          <input type="checkbox" muiCheckbox size="lg" checked />
          lg
        </label>
      </div>
    `,
    imports: [Checkbox],
  }),
};

export const Invalid: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:6px;">
        <label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;">
          <input type="checkbox" muiCheckbox invalid aria-invalid="true" aria-describedby="cb-err" />
          I agree to the terms
        </label>
        <p id="cb-err" role="alert" style="margin:0;font-size:12px;color:#dc2626;">You must accept the terms to continue.</p>
      </div>
    `,
    imports: [Checkbox],
  }),
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div>
          <p style="margin:0 0 8px;font-size:13px;color:#64748b;">Wrapped in &lt;label&gt; — click anywhere to toggle</p>
          <label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;">
            <input type="checkbox" muiCheckbox />
            Subscribe to newsletter
          </label>
        </div>
        <div>
          <p style="margin:0 0 8px;font-size:13px;color:#64748b;">Linked via aria-labelledby</p>
          <div style="display:flex;align-items:center;gap:8px;">
            <input type="checkbox" muiCheckbox id="cb-a11y" aria-labelledby="cb-label" />
            <span id="cb-label" style="font-size:14px;">Enable notifications</span>
          </div>
        </div>
        <div>
          <p style="margin:0 0 8px;font-size:13px;color:#64748b;">Min 44px touch target via label padding</p>
          <label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;min-height:44px;">
            <input type="checkbox" muiCheckbox />
            Tall touch target
          </label>
        </div>
      </div>
    `,
    imports: [Checkbox],
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    template: `
      <div style="width:375px;padding:16px;display:flex;flex-direction:column;gap:0;">
        ${['Apples', 'Bananas', 'Cherries', 'Dates']
          .map(
            (f) => `
          <label style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #e2e8f0;cursor:pointer;font-size:16px;min-height:44px;box-sizing:border-box;">
            <input type="checkbox" muiCheckbox size="lg" />
            ${f}
          </label>`,
          )
          .join('')}
      </div>
    `,
    imports: [Checkbox],
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
