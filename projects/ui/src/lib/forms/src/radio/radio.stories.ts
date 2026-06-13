import type { Meta, StoryObj } from '@storybook/angular';
import { Radio } from './radio';

const meta: Meta<Radio> = {
  title: 'Forms/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<Radio>;

export const Default: Story = {
  render: () => ({
    template: `
      <label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;">
        <input type="radio" muiRadio name="default" />
        Option A
      </label>
    `,
    imports: [Radio],
  }),
};

export const Group: Story = {
  render: () => ({
    template: `
      <fieldset style="border:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px;">
        <legend style="font-size:14px;font-weight:600;margin-bottom:8px;">Preferred contact method</legend>
        <label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;">
          <input type="radio" muiRadio name="contact" value="email" checked />
          Email
        </label>
        <label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;">
          <input type="radio" muiRadio name="contact" value="phone" />
          Phone
        </label>
        <label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;">
          <input type="radio" muiRadio name="contact" value="sms" />
          SMS
        </label>
      </fieldset>
    `,
    imports: [Radio],
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:center;gap:20px;">
        <label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-size:14px;">
          <input type="radio" muiRadio size="sm" name="sz" checked />
          sm
        </label>
        <label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-size:14px;">
          <input type="radio" muiRadio size="md" name="sz" />
          md
        </label>
        <label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-size:14px;">
          <input type="radio" muiRadio size="lg" name="sz" />
          lg
        </label>
      </div>
    `,
    imports: [Radio],
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <fieldset style="border:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px;">
        <legend style="font-size:14px;font-weight:600;margin-bottom:8px;">Plan</legend>
        <label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;">
          <input type="radio" muiRadio name="plan" value="free" checked />
          Free
        </label>
        <label style="display:inline-flex;align-items:center;gap:8px;font-size:14px;color:#94a3b8;cursor:not-allowed;">
          <input type="radio" muiRadio name="plan" value="pro" disabled />
          Pro (coming soon)
        </label>
      </fieldset>
    `,
    imports: [Radio],
  }),
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div>
          <p style="margin:0 0 8px;font-size:13px;color:#64748b;">Group inside &lt;fieldset&gt; + &lt;legend&gt; — announced as a group by screen readers</p>
          <fieldset style="border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin:0;">
            <legend style="font-size:14px;font-weight:600;padding:0 4px;">Notification frequency</legend>
            <div style="display:flex;flex-direction:column;gap:8px;margin-top:4px;">
              <label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;min-height:44px;">
                <input type="radio" muiRadio name="freq" value="daily" checked />
                Daily digest
              </label>
              <label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;min-height:44px;">
                <input type="radio" muiRadio name="freq" value="weekly" />
                Weekly summary
              </label>
              <label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;min-height:44px;">
                <input type="radio" muiRadio name="freq" value="never" />
                Never
              </label>
            </div>
          </fieldset>
        </div>
      </div>
    `,
    imports: [Radio],
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    template: `
      <div style="width:375px;padding:16px;">
        <fieldset style="border:none;padding:0;margin:0;">
          <legend style="font-size:16px;font-weight:600;margin-bottom:12px;">Shipping speed</legend>
          ${[
            ['standard', 'Standard — 5-7 days', 'Free'],
            ['express', 'Express — 2-3 days', '$9.99'],
            ['overnight', 'Overnight', '$24.99'],
          ]
            .map(
              ([v, l, p]) => `
            <label style="display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid #e2e8f0;cursor:pointer;min-height:44px;">
              <input type="radio" muiRadio size="lg" name="ship" value="${v}" ${v === 'standard' ? 'checked' : ''} />
              <div>
                <div style="font-size:15px;">${l}</div>
                <div style="font-size:13px;color:#64748b;">${p}</div>
              </div>
            </label>`,
            )
            .join('')}
        </fieldset>
      </div>
    `,
    imports: [Radio],
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
