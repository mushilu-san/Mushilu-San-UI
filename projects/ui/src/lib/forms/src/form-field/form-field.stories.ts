import type { Meta, StoryObj } from '@storybook/angular';
import { Checkbox } from '../checkbox/checkbox';
import { Input } from '../input/input';
import { Select } from '../select/select';
import { Textarea } from '../textarea/textarea';
import { Toggle } from '../toggle/toggle';
import { FormField } from './form-field';

const meta: Meta<FormField> = {
  title: 'Forms/FormField',
  component: FormField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    label:     { control: 'text' },
    hint:      { control: 'text' },
    error:     { control: 'text' },
    required:  { control: 'boolean' },
    disabled:  { control: 'boolean' },
    controlId: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<FormField>;

export const Default: Story = {
  render: () => ({
    template: `
      <div style="width:320px;">
        <mui-form-field label="Email address" controlId="email1">
          <input muiInput id="email1" type="email" placeholder="you@example.com" style="width:100%;box-sizing:border-box;" />
        </mui-form-field>
      </div>
    `,
    imports: [FormField, Input],
  }),
};

export const WithHint: Story = {
  render: () => ({
    template: `
      <div style="width:320px;">
        <mui-form-field label="Username" hint="Letters and numbers only, 3-20 characters." controlId="uname">
          <input muiInput id="uname" type="text" placeholder="cool_user_42" style="width:100%;box-sizing:border-box;" />
        </mui-form-field>
      </div>
    `,
    imports: [FormField, Input],
  }),
};

export const WithError: Story = {
  render: () => ({
    template: `
      <div style="width:320px;">
        <mui-form-field label="Email" error="Please enter a valid email address." controlId="email2">
          <input muiInput id="email2" type="email" invalid value="not-an-email"
            aria-invalid="true" style="width:100%;box-sizing:border-box;" />
        </mui-form-field>
      </div>
    `,
    imports: [FormField, Input],
  }),
};

export const Required: Story = {
  render: () => ({
    template: `
      <div style="width:320px;display:flex;flex-direction:column;gap:16px;">
        <mui-form-field label="First name" required controlId="fname">
          <input muiInput id="fname" type="text" aria-required="true" style="width:100%;box-sizing:border-box;" />
        </mui-form-field>
        <mui-form-field label="Last name" required controlId="lname">
          <input muiInput id="lname" type="text" aria-required="true" style="width:100%;box-sizing:border-box;" />
        </mui-form-field>
      </div>
    `,
    imports: [FormField, Input],
  }),
};

export const AllControls: Story = {
  render: () => ({
    template: `
      <div style="width:340px;display:flex;flex-direction:column;gap:20px;">
        <mui-form-field label="Full name" required controlId="fullname">
          <input muiInput id="fullname" type="text" aria-required="true" style="width:100%;box-sizing:border-box;" />
        </mui-form-field>

        <mui-form-field label="Email" hint="We'll never share your email." controlId="email3">
          <input muiInput id="email3" type="email" placeholder="you@example.com" style="width:100%;box-sizing:border-box;" />
        </mui-form-field>

        <mui-form-field label="Country" controlId="country1">
          <select muiSelect id="country1" style="width:100%;">
            <option value="">Select…</option>
            <option>United States</option>
            <option>United Kingdom</option>
          </select>
        </mui-form-field>

        <mui-form-field label="Bio" hint="Max 200 characters." controlId="bio1">
          <textarea muiTextarea id="bio1" resize="none" rows="3"
            placeholder="Tell us about yourself…" style="width:100%;box-sizing:border-box;"></textarea>
        </mui-form-field>

        <mui-form-field label="Email notifications" controlId="">
          <label style="display:inline-flex;align-items:center;gap:10px;cursor:pointer;font-size:14px;min-height:44px;">
            <mui-toggle label="Email notifications"></mui-toggle>
            Receive email notifications
          </label>
        </mui-form-field>

        <mui-form-field label="" controlId="">
          <label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;min-height:44px;">
            <input type="checkbox" muiCheckbox />
            I agree to the terms and conditions
          </label>
        </mui-form-field>
      </div>
    `,
    imports: [FormField, Input, Select, Textarea, Toggle, Checkbox],
  }),
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="width:340px;display:flex;flex-direction:column;gap:20px;">
        <div>
          <p style="margin:0 0 8px;font-size:13px;color:#64748b;">label[for] wired to input id — screen reader announces "Email, required"</p>
          <mui-form-field label="Email" required controlId="acc-email">
            <input muiInput id="acc-email" type="email" aria-required="true"
              style="width:100%;box-sizing:border-box;" />
          </mui-form-field>
        </div>
        <div>
          <p style="margin:0 0 8px;font-size:13px;color:#64748b;">error uses role=alert — announced immediately by screen readers</p>
          <mui-form-field label="Password" error="Password must be at least 8 characters." controlId="acc-pw">
            <input muiInput id="acc-pw" type="password" invalid aria-invalid="true"
              style="width:100%;box-sizing:border-box;" />
          </mui-form-field>
        </div>
        <div>
          <p style="margin:0 0 8px;font-size:13px;color:#64748b;">hint shown only when no error</p>
          <mui-form-field label="Username" hint="3-20 characters, letters and numbers." controlId="acc-user">
            <input muiInput id="acc-user" type="text"
              style="width:100%;box-sizing:border-box;" />
          </mui-form-field>
        </div>
      </div>
    `,
    imports: [FormField, Input],
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    template: `
      <div style="width:375px;padding:16px;display:flex;flex-direction:column;gap:20px;">
        <mui-form-field label="Full name" required controlId="m-name">
          <input muiInput size="lg" id="m-name" type="text" style="width:100%;box-sizing:border-box;" />
        </mui-form-field>
        <mui-form-field label="Email" hint="We'll never spam you." controlId="m-email">
          <input muiInput size="lg" id="m-email" type="email" placeholder="you@example.com" style="width:100%;box-sizing:border-box;" />
        </mui-form-field>
        <mui-form-field label="Role" controlId="m-role">
          <select muiSelect size="lg" id="m-role" style="width:100%;">
            <option value="">Select role…</option>
            <option>Designer</option>
            <option>Engineer</option>
            <option>Product</option>
          </select>
        </mui-form-field>
      </div>
    `,
    imports: [FormField, Input, Select],
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
