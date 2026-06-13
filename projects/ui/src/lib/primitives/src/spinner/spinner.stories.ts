import type { Meta, StoryObj } from '@storybook/angular';
import { Button } from '../button/button';
import { Spinner } from './spinner';

const meta: Meta<Spinner> = {
  title: 'Primitives/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    color: {
      control: 'select',
      options: ['inherit', 'primary', 'muted', 'danger', 'success', 'warning'],
    },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<Spinner>;

export const Default: Story = {
  args: { size: 'md', color: 'primary', label: 'Loading' },
};

export const Sizes: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;align-items:center;gap:20px;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-spinner size="sm" color="primary" />
          <span style="font-size:11px;color:#64748b;">sm 16px</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-spinner size="md" color="primary" />
          <span style="font-size:11px;color:#64748b;">md 24px</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-spinner size="lg" color="primary" />
          <span style="font-size:11px;color:#64748b;">lg 32px</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-spinner size="xl" color="primary" />
          <span style="font-size:11px;color:#64748b;">xl 48px</span>
        </div>
      </div>
    `,
    imports: [Spinner],
  }),
};

export const Colors: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;align-items:center;gap:20px;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-spinner size="lg" color="inherit" />
          <span style="font-size:11px;color:#64748b;">inherit</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-spinner size="lg" color="primary" />
          <span style="font-size:11px;color:#64748b;">primary</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-spinner size="lg" color="muted" />
          <span style="font-size:11px;color:#64748b;">muted</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-spinner size="lg" color="danger" />
          <span style="font-size:11px;color:#64748b;">danger</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-spinner size="lg" color="success" />
          <span style="font-size:11px;color:#64748b;">success</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-spinner size="lg" color="warning" />
          <span style="font-size:11px;color:#64748b;">warning</span>
        </div>
      </div>
    `,
    imports: [Spinner],
  }),
};

export const InContext: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;min-width:260px;">
        <div style="display:flex;align-items:center;gap:12px;padding:16px;border:1px solid #e2e8f0;border-radius:8px;">
          <mui-spinner size="md" color="primary" />
          <span style="font-size:14px;">Loading your data…</span>
        </div>
        <div style="display:flex;align-items:center;justify-content:center;padding:32px;border:1px solid #e2e8f0;border-radius:8px;">
          <mui-spinner size="xl" color="primary" label="Loading page content" />
        </div>
      </div>
    `,
    imports: [Spinner],
  }),
};

export const WithButton: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;gap:12px;align-items:center;">
        <button muiButton [loading]="true">Saving</button>
        <span style="color:#64748b;font-size:13px;">Button has built-in loading state</span>
        <mui-spinner size="sm" color="muted" />
        <span style="color:#64748b;font-size:13px;">Standalone spinner</span>
      </div>
    `,
    imports: [Spinner, Button],
  }),
};

export const Accessibility: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <mui-spinner size="md" color="primary" />
          <span style="font-size:13px;color:#64748b;">Default label: "Loading" (role=status)</span>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <mui-spinner size="md" color="primary" label="Uploading file, please wait" />
          <span style="font-size:13px;color:#64748b;">Custom label for screen readers</span>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <div role="region" aria-busy="true" aria-label="Results loading"
               style="display:flex;align-items:center;gap:8px;padding:12px;border:1px solid #e2e8f0;border-radius:6px;">
            <mui-spinner size="sm" color="primary" />
            <span style="font-size:13px;">aria-busy on the container, spinner is the visual</span>
          </div>
        </div>
      </div>
    `,
    imports: [Spinner],
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="width:375px;padding:16px;">
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:40px;border:1px solid #e2e8f0;border-radius:8px;">
          <mui-spinner size="xl" color="primary" label="Loading your feed" />
          <p style="margin:0;font-size:14px;color:#64748b;text-align:center;">Loading your feed…</p>
        </div>
      </div>
    `,
    imports: [Spinner],
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
