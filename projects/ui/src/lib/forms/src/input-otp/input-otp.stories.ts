import type { Meta, StoryObj } from '@storybook/angular';
import { InputOtp } from './input-otp';

const meta: Meta<InputOtp> = {
  title: 'Forms/InputOtp',
  component: InputOtp,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    length:   { control: 'number' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<InputOtp>;

export const Default: Story = {
  render: () => ({
    template: `<mui-input-otp [(value)]="otp" />`,
    imports: [InputOtp],
    componentProperties: { otp: '' },
  }),
};

export const FourDigit: Story = {
  render: () => ({
    template: `<mui-input-otp [length]="4" [(value)]="otp" />`,
    imports: [InputOtp],
    componentProperties: { otp: '' },
  }),
};

export const PreFilled: Story = {
  render: () => ({
    template: `<mui-input-otp [value]="otp" />`,
    imports: [InputOtp],
    componentProperties: { otp: '483920' },
  }),
};

export const WithValueDisplay: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:12px;">
        <mui-input-otp [(value)]="otp" />
        <p style="margin:0;font-size:13px;color:#64748b;">Value: "{{ otp }}" ({{ otp.length }}/6)</p>
      </div>
    `,
    imports: [InputOtp],
    componentProperties: { otp: '' },
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<mui-input-otp [value]="'483920'" [disabled]="true" />`,
    imports: [InputOtp],
    componentProperties: {},
  }),
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
        <p id="otp-label" style="margin:0;font-size:14px;font-weight:500;">Verification code</p>
        <p id="otp-desc" style="margin:0;font-size:13px;color:#64748b;">
          Enter the 6-digit code sent to your email.
        </p>
        <mui-input-otp
          [(value)]="otp"
          aria-labelledby="otp-label"
          aria-describedby="otp-desc"
        />
        @if (otp.length === 6) {
          <p role="status" style="margin:0;font-size:13px;color:#16a34a;">
            Code entered! Verifying…
          </p>
        }
      </div>
    `,
    imports: [InputOtp],
    componentProperties: { otp: '' },
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    template: `
      <div style="width:375px;padding:24px;display:flex;flex-direction:column;gap:16px;align-items:center;">
        <p style="margin:0;font-size:16px;font-weight:600;text-align:center;">Enter verification code</p>
        <p style="margin:0;font-size:14px;color:#64748b;text-align:center;">
          We sent a code to your phone number.
        </p>
        <mui-input-otp [(value)]="otp" />
        <button type="button" style="height:44px;width:100%;background:#2563eb;color:#fff;
          border:none;border-radius:8px;font-size:16px;cursor:pointer;">
          Verify
        </button>
      </div>
    `,
    imports: [InputOtp],
    componentProperties: { otp: '' },
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
