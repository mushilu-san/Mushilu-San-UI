import type { Meta, StoryObj } from '@storybook/angular';
import { Button } from '../button/button';
import { Icon } from './icon';
import type { IconName } from './icon.types';

const ALL_ICONS: IconName[] = [
  'arrow-left',
  'arrow-right',
  'bell',
  'calendar',
  'check',
  'check-circle',
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'chevron-up',
  'copy',
  'download',
  'edit',
  'external-link',
  'eye',
  'eye-off',
  'filter',
  'heart',
  'home',
  'info',
  'loading',
  'mail',
  'map-pin',
  'menu',
  'minus',
  'more-horizontal',
  'more-vertical',
  'phone',
  'plus',
  'search',
  'settings',
  'star',
  'trash',
  'upload',
  'user',
  'x',
];

const meta: Meta<Icon> = {
  title: 'Primitives/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    name: { control: 'select', options: ALL_ICONS },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    color: {
      control: 'select',
      options: ['inherit', 'primary', 'muted', 'danger', 'success', 'warning'],
    },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<Icon>;

export const Default: Story = {
  args: { name: 'check', size: 'md', color: 'inherit' },
};

export const Sizes: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;align-items:center;gap:20px;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-icon name="star" size="xs" />
          <span style="font-size:11px;color:#64748b;">xs 12px</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-icon name="star" size="sm" />
          <span style="font-size:11px;color:#64748b;">sm 16px</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-icon name="star" size="md" />
          <span style="font-size:11px;color:#64748b;">md 20px</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-icon name="star" size="lg" />
          <span style="font-size:11px;color:#64748b;">lg 24px</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-icon name="star" size="xl" />
          <span style="font-size:11px;color:#64748b;">xl 32px</span>
        </div>
      </div>
    `,
    imports: [Icon],
  }),
};

export const Colors: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;align-items:center;gap:20px;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-icon name="heart" size="lg" color="inherit" />
          <span style="font-size:11px;color:#64748b;">inherit</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-icon name="heart" size="lg" color="primary" />
          <span style="font-size:11px;color:#64748b;">primary</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-icon name="heart" size="lg" color="muted" />
          <span style="font-size:11px;color:#64748b;">muted</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-icon name="heart" size="lg" color="danger" />
          <span style="font-size:11px;color:#64748b;">danger</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-icon name="heart" size="lg" color="success" />
          <span style="font-size:11px;color:#64748b;">success</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-icon name="heart" size="lg" color="warning" />
          <span style="font-size:11px;color:#64748b;">warning</span>
        </div>
      </div>
    `,
    imports: [Icon],
  }),
};

export const AllIcons: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:8px;max-width:640px;">
        ${ALL_ICONS.map(
          (name) => `
          <div style="display:flex;flex-direction:column;align-items:center;gap:6px;width:80px;padding:8px;border-radius:6px;">
            <mui-icon name="${name}" size="md" />
            <span style="font-size:10px;color:#64748b;text-align:center;word-break:break-all;">${name}</span>
          </div>
        `,
        ).join('')}
      </div>
    `,
    imports: [Icon],
  }),
  parameters: { layout: 'padded' },
};

export const Loading: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;align-items:center;gap:16px;">
        <mui-icon name="loading" size="sm" color="muted" />
        <mui-icon name="loading" size="md" color="primary" />
        <mui-icon name="loading" size="lg" color="primary" />
      </div>
    `,
    imports: [Icon],
  }),
};

export const WithButton: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        <button muiButton>
          <mui-icon name="check" muiButtonIconStart />
          Confirm
        </button>
        <button muiButton variant="secondary">
          <mui-icon name="edit" muiButtonIconStart />
          Edit
        </button>
        <button muiButton variant="destructive">
          Delete
          <mui-icon name="trash" muiButtonIconEnd />
        </button>
        <button muiButton variant="ghost">
          <mui-icon name="loading" muiButtonIconStart />
          Saving…
        </button>
      </div>
    `,
    imports: [Icon, Button],
  }),
};

export const Accessibility: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <mui-icon name="info" color="primary" />
          <span>Decorative icon (aria-hidden, no label needed)</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <mui-icon name="check-circle" color="success" label="Success" />
          <span>Meaningful icon (label="Success")</span>
        </div>
        <button style="display:inline-flex;align-items:center;gap:4px;background:none;border:1px solid #e2e8f0;border-radius:6px;padding:8px;cursor:pointer;">
          <mui-icon name="x" label="Close dialog" />
        </button>
      </div>
    `,
    imports: [Icon],
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="width:375px;padding:16px;">
        <nav style="display:flex;justify-content:space-around;padding:12px 0;border-top:1px solid #e2e8f0;">
          <button style="display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer;color:#2563eb;min-width:44px;min-height:44px;justify-content:center;">
            <mui-icon name="home" size="lg" color="primary" />
            <span style="font-size:10px;">Home</span>
          </button>
          <button style="display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer;color:#64748b;min-width:44px;min-height:44px;justify-content:center;">
            <mui-icon name="search" size="lg" color="muted" />
            <span style="font-size:10px;color:#64748b;">Search</span>
          </button>
          <button style="display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer;color:#64748b;min-width:44px;min-height:44px;justify-content:center;">
            <mui-icon name="bell" size="lg" color="muted" />
            <span style="font-size:10px;color:#64748b;">Alerts</span>
          </button>
          <button style="display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer;color:#64748b;min-width:44px;min-height:44px;justify-content:center;">
            <mui-icon name="user" size="lg" color="muted" />
            <span style="font-size:10px;color:#64748b;">Profile</span>
          </button>
        </nav>
      </div>
    `,
    imports: [Icon],
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
