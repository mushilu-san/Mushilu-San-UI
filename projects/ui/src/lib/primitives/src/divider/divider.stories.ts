import type { Meta, StoryObj } from '@storybook/angular';
import { Divider } from './divider';

const meta: Meta<Divider> = {
  title: 'Primitives/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant: { control: 'select', options: ['solid', 'dashed', 'dotted'] },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<Divider>;

export const Default: Story = {
  args: { orientation: 'horizontal', variant: 'solid' },
  render: (args) => ({
    props: args,
    template: `<div style="width:300px;"><mui-divider [orientation]="orientation" [variant]="variant" [label]="label"></mui-divider></div>`,
    imports: [Divider],
  }),
};

export const Variants: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;flex-direction:column;gap:24px;width:320px;">
        <div>
          <p style="margin:0 0 8px;font-size:12px;color:#64748b;">solid (default)</p>
          <mui-divider variant="solid"></mui-divider>
        </div>
        <div>
          <p style="margin:0 0 8px;font-size:12px;color:#64748b;">dashed</p>
          <mui-divider variant="dashed"></mui-divider>
        </div>
        <div>
          <p style="margin:0 0 8px;font-size:12px;color:#64748b;">dotted</p>
          <mui-divider variant="dotted"></mui-divider>
        </div>
      </div>
    `,
    imports: [Divider],
  }),
};

export const WithLabel: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;flex-direction:column;gap:24px;width:320px;">
        <mui-divider label="or"></mui-divider>
        <mui-divider label="Continue with"></mui-divider>
        <mui-divider label="Section title" variant="dashed"></mui-divider>
      </div>
    `,
    imports: [Divider],
  }),
};

export const Vertical: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;align-items:stretch;gap:0;height:80px;">
        <span style="padding:0 16px;display:flex;align-items:center;font-size:14px;">Left</span>
        <mui-divider orientation="vertical"></mui-divider>
        <span style="padding:0 16px;display:flex;align-items:center;font-size:14px;">Right</span>
        <mui-divider orientation="vertical" variant="dashed"></mui-divider>
        <span style="padding:0 16px;display:flex;align-items:center;font-size:14px;">Far right</span>
      </div>
    `,
    imports: [Divider],
  }),
};

export const InContext: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;flex-direction:column;gap:0;width:320px;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
        <div style="padding:16px;">
          <p style="margin:0;font-weight:600;">Sign in</p>
        </div>
        <div style="padding:16px;display:flex;flex-direction:column;gap:12px;">
          <input placeholder="Email" style="border:1px solid #e2e8f0;border-radius:6px;padding:8px 12px;font-size:14px;width:100%;box-sizing:border-box;" />
          <input placeholder="Password" type="password" style="border:1px solid #e2e8f0;border-radius:6px;padding:8px 12px;font-size:14px;width:100%;box-sizing:border-box;" />
          <button style="background:#6366f1;color:#fff;border:none;border-radius:6px;padding:10px;font-size:14px;cursor:pointer;">Sign in</button>
          <mui-divider label="or"></mui-divider>
          <button style="background:#fff;border:1px solid #e2e8f0;border-radius:6px;padding:10px;font-size:14px;cursor:pointer;">Continue with Google</button>
        </div>
      </div>
    `,
    imports: [Divider],
  }),
};

export const Accessibility: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;width:320px;">
        <div>
          <p style="margin:0 0 8px;font-size:13px;color:#64748b;">Decorative — role="separator" (default)</p>
          <mui-divider></mui-divider>
        </div>
        <div>
          <p style="margin:0 0 8px;font-size:13px;color:#64748b;">Labelled — aria-label on host, inner text is aria-hidden</p>
          <mui-divider label="or continue with"></mui-divider>
        </div>
        <div>
          <p style="margin:0 0 8px;font-size:13px;color:#64748b;">Vertical — aria-orientation="vertical"</p>
          <div style="height:60px;display:flex;align-items:stretch;">
            <span style="padding:0 12px;display:flex;align-items:center;font-size:14px;">Left</span>
            <mui-divider orientation="vertical"></mui-divider>
            <span style="padding:0 12px;display:flex;align-items:center;font-size:14px;">Right</span>
          </div>
        </div>
      </div>
    `,
    imports: [Divider],
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="width:375px;padding:16px;display:flex;flex-direction:column;gap:16px;">
        <p style="margin:0;font-size:14px;">Above the divider</p>
        <mui-divider label="or"></mui-divider>
        <p style="margin:0;font-size:14px;">Below the divider</p>
      </div>
    `,
    imports: [Divider],
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
