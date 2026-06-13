import type { Meta, StoryObj } from '@storybook/angular';
import { Badge } from './badge';

const meta: Meta<Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger', 'info'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    dot: { control: 'boolean' },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<Badge>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<mui-badge [variant]="variant" [size]="size" [dot]="dot" [label]="label">Badge</mui-badge>`,
  }),
  args: { variant: 'default', size: 'md', dot: false },
};

export const Variants: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
        <mui-badge variant="default">Default</mui-badge>
        <mui-badge variant="primary">Primary</mui-badge>
        <mui-badge variant="success">Success</mui-badge>
        <mui-badge variant="warning">Warning</mui-badge>
        <mui-badge variant="danger">Danger</mui-badge>
        <mui-badge variant="info">Info</mui-badge>
      </div>
    `,
    imports: [Badge],
  }),
};

export const Sizes: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;align-items:center;gap:8px;">
        <mui-badge variant="primary" size="sm">Small</mui-badge>
        <mui-badge variant="primary" size="md">Medium</mui-badge>
        <mui-badge variant="primary" size="lg">Large</mui-badge>
      </div>
    `,
    imports: [Badge],
  }),
};

export const DotIndicators: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;align-items:center;gap:12px;">
        <mui-badge dot variant="default" label="Offline"></mui-badge>
        <mui-badge dot variant="primary" label="Active"></mui-badge>
        <mui-badge dot variant="success" label="Online"></mui-badge>
        <mui-badge dot variant="warning" label="Away"></mui-badge>
        <mui-badge dot variant="danger" label="Error"></mui-badge>
        <mui-badge dot variant="info" label="Info"></mui-badge>
      </div>
    `,
    imports: [Badge],
  }),
};

export const DotSizes: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;align-items:center;gap:12px;">
        <mui-badge dot variant="success" size="sm" label="Small"></mui-badge>
        <mui-badge dot variant="success" size="md" label="Medium"></mui-badge>
        <mui-badge dot variant="success" size="lg" label="Large"></mui-badge>
      </div>
    `,
    imports: [Badge],
  }),
};

export const InContext: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;min-width:260px;">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px;border:1px solid #e2e8f0;border-radius:8px;">
          <span style="font-size:14px;">Pull request merged</span>
          <mui-badge variant="primary">Merged</mui-badge>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px;border:1px solid #e2e8f0;border-radius:8px;">
          <span style="font-size:14px;">Build passing</span>
          <mui-badge variant="success">Passing</mui-badge>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px;border:1px solid #e2e8f0;border-radius:8px;">
          <span style="font-size:14px;">Deployment pending</span>
          <mui-badge variant="warning">Pending</mui-badge>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px;border:1px solid #e2e8f0;border-radius:8px;">
          <span style="font-size:14px;">Tests failing</span>
          <mui-badge variant="danger">Failed</mui-badge>
        </div>
      </div>
    `,
    imports: [Badge],
  }),
};

export const WithStatusDot: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;min-width:220px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <mui-badge dot variant="success" label="Online"></mui-badge>
          <span style="font-size:14px;">Alice — Online</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <mui-badge dot variant="warning" label="Away"></mui-badge>
          <span style="font-size:14px;">Bob — Away</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <mui-badge dot variant="default" label="Offline"></mui-badge>
          <span style="font-size:14px;">Carol — Offline</span>
        </div>
      </div>
    `,
    imports: [Badge],
  }),
};

export const Accessibility: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <mui-badge variant="success">Active</mui-badge>
          <span style="font-size:12px;color:#64748b;">Text content read by screen reader</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <mui-badge dot variant="danger" label="3 unread notifications"></mui-badge>
          <span style="font-size:12px;color:#64748b;">Dot with aria-label</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <mui-badge dot variant="success"></mui-badge>
          <span style="font-size:12px;color:#64748b;">Dot without label (aria-hidden, decorative)</span>
        </div>
      </div>
    `,
    imports: [Badge],
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="width:375px;padding:16px;display:flex;flex-direction:column;gap:12px;">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px;border:1px solid #e2e8f0;border-radius:8px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <mui-badge dot variant="success" label="Online"></mui-badge>
            <span style="font-size:14px;font-weight:500;">Server status</span>
          </div>
          <mui-badge variant="success">Healthy</mui-badge>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px;border:1px solid #e2e8f0;border-radius:8px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <mui-badge dot variant="warning" label="Degraded"></mui-badge>
            <span style="font-size:14px;font-weight:500;">API latency</span>
          </div>
          <mui-badge variant="warning">Degraded</mui-badge>
        </div>
      </div>
    `,
    imports: [Badge],
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
