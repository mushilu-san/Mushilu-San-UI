import type { Meta, StoryObj } from '@storybook/angular';
import { Input } from './input';

const meta: Meta<Input> = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size:    { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outline', 'filled', 'ghost'] },
    invalid: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Input>;

export const Default: Story = {
  render: () => ({
    template: `<input muiInput placeholder="Enter text…" aria-label="Text input" style="width:280px;" />`,
    imports: [Input],
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;width:280px;">
        <input muiInput size="sm" placeholder="Small (32px)"  aria-label="Small input" />
        <input muiInput size="md" placeholder="Medium (40px)" aria-label="Medium input" />
        <input muiInput size="lg" placeholder="Large (48px)"  aria-label="Large input" />
      </div>
    `,
    imports: [Input],
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;width:280px;padding:16px;background:#f8fafc;border-radius:8px;">
        <input muiInput variant="outline" placeholder="Outline" aria-label="Outline input" />
        <input muiInput variant="filled"  placeholder="Filled"  aria-label="Filled input" />
        <input muiInput variant="ghost"   placeholder="Ghost"   aria-label="Ghost input" />
      </div>
    `,
    imports: [Input],
  }),
};

export const Types: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;width:280px;">
        <input muiInput type="text"     placeholder="Text"     aria-label="Text" />
        <input muiInput type="email"    placeholder="Email"    aria-label="Email" />
        <input muiInput type="password" placeholder="Password" aria-label="Password" />
        <input muiInput type="number"   placeholder="Number"   aria-label="Number" />
        <input muiInput type="search"   placeholder="Search…"  aria-label="Search" />
      </div>
    `,
    imports: [Input],
  }),
};

export const Invalid: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:6px;width:280px;">
        <input muiInput invalid value="bad-email" aria-label="Email" aria-invalid="true" aria-describedby="email-err" />
        <p id="email-err" role="alert" style="margin:0;font-size:12px;color:#dc2626;">Please enter a valid email address.</p>
      </div>
    `,
    imports: [Input],
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;width:280px;">
        <input muiInput disabled placeholder="Disabled input" aria-label="Disabled input" />
        <input muiInput disabled value="Prefilled but disabled" aria-label="Prefilled disabled" />
      </div>
    `,
    imports: [Input],
  }),
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;width:300px;">
        <div style="display:flex;flex-direction:column;gap:4px;">
          <label for="acc1" style="font-size:14px;font-weight:500;">Linked via label for/id</label>
          <input muiInput id="acc1" type="text" placeholder="Accessible input" />
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          <input muiInput type="text" aria-label="aria-label only" placeholder="aria-label only" />
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          <label for="acc3" style="font-size:14px;font-weight:500;">Email <span aria-hidden="true" style="color:#dc2626;">*</span></label>
          <input muiInput id="acc3" type="email" aria-required="true" invalid placeholder="Invalid state"
            aria-invalid="true" aria-describedby="acc3-err" />
          <p id="acc3-err" role="alert" style="margin:0;font-size:12px;color:#dc2626;">Email is required</p>
        </div>
      </div>
    `,
    imports: [Input],
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    template: `
      <div style="width:375px;padding:16px;display:flex;flex-direction:column;gap:12px;">
        <input muiInput type="text"  placeholder="Full name"  aria-label="Full name" />
        <input muiInput type="email" placeholder="Email"      aria-label="Email" />
        <input muiInput type="tel"   placeholder="Phone"      aria-label="Phone" />
      </div>
    `,
    imports: [Input],
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
