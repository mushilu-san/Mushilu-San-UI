import type { Meta, StoryObj } from '@storybook/angular';
import { Toggle } from './toggle';

const meta: Meta<Toggle> = {
  title: 'Forms/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size:     { control: 'select', options: ['sm', 'md', 'lg'] },
    checked:  { control: 'boolean' },
    disabled: { control: 'boolean' },
    label:    { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<Toggle>;

export const Default: Story = {
  args: { label: 'Enable notifications', size: 'md' },
};

export const WithLabel: Story = {
  render: () => ({
    template: `
      <label style="display:inline-flex;align-items:center;gap:10px;cursor:pointer;font-size:14px;">
        <mui-toggle label="Dark mode"></mui-toggle>
        Dark mode
      </label>
    `,
    imports: [Toggle],
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:center;gap:20px;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-toggle size="sm" label="Small" [checked]="true"></mui-toggle>
          <span style="font-size:11px;color:#64748b;">sm</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-toggle size="md" label="Medium" [checked]="true"></mui-toggle>
          <span style="font-size:11px;color:#64748b;">md</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-toggle size="lg" label="Large" [checked]="true"></mui-toggle>
          <span style="font-size:11px;color:#64748b;">lg</span>
        </div>
      </div>
    `,
    imports: [Toggle],
  }),
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:14px;">
        <label style="display:inline-flex;align-items:center;gap:10px;cursor:pointer;font-size:14px;">
          <mui-toggle label="Off" [checked]="false"></mui-toggle>
          Off
        </label>
        <label style="display:inline-flex;align-items:center;gap:10px;cursor:pointer;font-size:14px;">
          <mui-toggle label="On" [checked]="true"></mui-toggle>
          On
        </label>
        <label style="display:inline-flex;align-items:center;gap:10px;font-size:14px;color:#94a3b8;cursor:not-allowed;">
          <mui-toggle label="Disabled off" [checked]="false" disabled></mui-toggle>
          Disabled off
        </label>
        <label style="display:inline-flex;align-items:center;gap:10px;font-size:14px;color:#94a3b8;cursor:not-allowed;">
          <mui-toggle label="Disabled on" [checked]="true" disabled></mui-toggle>
          Disabled on
        </label>
      </div>
    `,
    imports: [Toggle],
  }),
};

export const SettingsList: Story = {
  render: () => ({
    template: `
      <div style="width:320px;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
        ${[
          ['Email notifications', true],
          ['Push notifications', false],
          ['Weekly digest', true],
          ['Marketing emails', false],
        ].map(([label, on]) => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #e2e8f0;">
            <span style="font-size:14px;">${label}</span>
            <mui-toggle label="${label}" [checked]="${on}"></mui-toggle>
          </div>`).join('')}
      </div>
    `,
    imports: [Toggle],
  }),
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div>
          <p style="margin:0 0 8px;font-size:13px;color:#64748b;">role="switch" + aria-label — keyboard: Tab to focus, Space/Enter to toggle</p>
          <label style="display:inline-flex;align-items:center;gap:10px;cursor:pointer;font-size:14px;">
            <mui-toggle label="Airplane mode"></mui-toggle>
            Airplane mode
          </label>
        </div>
        <div>
          <p style="margin:0 0 8px;font-size:13px;color:#64748b;">Disabled — aria-disabled="true", tabindex="-1", not operable</p>
          <label style="display:inline-flex;align-items:center;gap:10px;font-size:14px;color:#94a3b8;cursor:not-allowed;">
            <mui-toggle label="Locked feature" disabled></mui-toggle>
            Locked feature
          </label>
        </div>
        <div>
          <p style="margin:0 0 8px;font-size:13px;color:#64748b;">44px touch target via outer label</p>
          <label style="display:inline-flex;align-items:center;gap:10px;cursor:pointer;font-size:14px;min-height:44px;">
            <mui-toggle label="Auto-save"></mui-toggle>
            Auto-save
          </label>
        </div>
      </div>
    `,
    imports: [Toggle],
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    template: `
      <div style="width:375px;padding:16px;display:flex;flex-direction:column;gap:0;">
        ${[['Wi-Fi', true], ['Bluetooth', true], ['Airplane Mode', false], ['Do Not Disturb', false]].map(([l, on]) => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 0;border-bottom:1px solid #e2e8f0;min-height:56px;box-sizing:border-box;">
            <span style="font-size:17px;">${l}</span>
            <mui-toggle size="lg" label="${l}" [checked]="${on}"></mui-toggle>
          </div>`).join('')}
      </div>
    `,
    imports: [Toggle],
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
