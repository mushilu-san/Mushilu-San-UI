import type { Meta, StoryObj } from '@storybook/angular';
import { Label } from './label';

const meta: Meta<Label> = {
  title: 'Forms/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    for:      { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Label>;

export const Default: Story = {
  render: () => ({
    template: `<mui-label>Email address</mui-label>`,
    imports: [Label],
  }),
};

export const Required: Story = {
  render: () => ({
    template: `<mui-label required>Password</mui-label>`,
    imports: [Label],
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<mui-label disabled>Disabled field</mui-label>`,
    imports: [Label],
  }),
};

export const WithInput: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:6px;width:280px;">
        <mui-label for="email" required>Email address</mui-label>
        <input id="email" type="email" placeholder="you@example.com"
          style="border:1px solid #64748b;border-radius:8px;padding:0 12px;height:40px;font-size:16px;outline:none;width:100%;box-sizing:border-box;" />
      </div>
    `,
    imports: [Label],
  }),
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="display:flex;flex-direction:column;gap:4px;">
          <mui-label for="a1">Plain label — links via for/id</mui-label>
          <input id="a1" type="text" aria-label="Plain label" style="border:1px solid #64748b;border-radius:8px;padding:0 12px;height:36px;font-size:14px;" />
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          <mui-label for="a2" required>Required — asterisk is aria-hidden, label text carries meaning</mui-label>
          <input id="a2" type="text" aria-required="true" aria-label="Required field" style="border:1px solid #64748b;border-radius:8px;padding:0 12px;height:36px;font-size:14px;" />
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          <mui-label for="a3" disabled>Disabled label — muted colour only, no aria-disabled on label itself</mui-label>
          <input id="a3" type="text" disabled style="border:1px solid #cbd5e1;border-radius:8px;padding:0 12px;height:36px;font-size:14px;" />
        </div>
      </div>
    `,
    imports: [Label],
  }),
  parameters: { a11y: { disable: false } },
};
