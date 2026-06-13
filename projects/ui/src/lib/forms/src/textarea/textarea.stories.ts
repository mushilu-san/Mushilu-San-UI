import type { Meta, StoryObj } from '@storybook/angular';
import { Textarea } from './textarea';

const meta: Meta<Textarea> = {
  title: 'Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outline', 'filled', 'ghost'] },
    resize: { control: 'select', options: ['none', 'vertical', 'both'] },
    invalid: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Textarea>;

export const Default: Story = {
  render: () => ({
    template: `<textarea muiTextarea placeholder="Write something…" aria-label="Message" style="width:320px;"></textarea>`,
    imports: [Textarea],
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;width:320px;">
        <textarea muiTextarea size="sm" placeholder="Small"  aria-label="Small textarea"></textarea>
        <textarea muiTextarea size="md" placeholder="Medium" aria-label="Medium textarea"></textarea>
        <textarea muiTextarea size="lg" placeholder="Large"  aria-label="Large textarea"></textarea>
      </div>
    `,
    imports: [Textarea],
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;width:320px;padding:16px;background:#f8fafc;border-radius:8px;">
        <textarea muiTextarea variant="outline" placeholder="Outline" aria-label="Outline"></textarea>
        <textarea muiTextarea variant="filled"  placeholder="Filled"  aria-label="Filled"></textarea>
        <textarea muiTextarea variant="ghost"   placeholder="Ghost"   aria-label="Ghost"></textarea>
      </div>
    `,
    imports: [Textarea],
  }),
};

export const ResizeModes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;width:320px;">
        <div>
          <p style="margin:0 0 4px;font-size:12px;color:#64748b;">resize="vertical" (default)</p>
          <textarea muiTextarea resize="vertical" placeholder="Drag the bottom-right corner" aria-label="Vertical resize"></textarea>
        </div>
        <div>
          <p style="margin:0 0 4px;font-size:12px;color:#64748b;">resize="both"</p>
          <textarea muiTextarea resize="both" placeholder="Resize in both directions" aria-label="Both resize"></textarea>
        </div>
        <div>
          <p style="margin:0 0 4px;font-size:12px;color:#64748b;">resize="none"</p>
          <textarea muiTextarea resize="none" placeholder="Not resizable" aria-label="No resize"></textarea>
        </div>
      </div>
    `,
    imports: [Textarea],
  }),
};

export const Invalid: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:6px;width:320px;">
        <textarea muiTextarea invalid aria-label="Message" aria-invalid="true" aria-describedby="ta-err"
          placeholder="Too short…"></textarea>
        <p id="ta-err" role="alert" style="margin:0;font-size:12px;color:#dc2626;">Message must be at least 20 characters.</p>
      </div>
    `,
    imports: [Textarea],
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<textarea muiTextarea disabled aria-label="Disabled" style="width:320px;">This content is read-only.</textarea>`,
    imports: [Textarea],
  }),
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;width:320px;">
        <div style="display:flex;flex-direction:column;gap:4px;">
          <label for="ta1" style="font-size:14px;font-weight:500;">Message</label>
          <textarea muiTextarea id="ta1" placeholder="Linked via label for/id" aria-required="true"></textarea>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          <label for="ta2" style="font-size:14px;font-weight:500;">
            Bio <span aria-hidden="true" style="color:#dc2626;">*</span>
          </label>
          <textarea muiTextarea id="ta2" invalid aria-invalid="true" aria-describedby="ta2-err"
            placeholder="Too short…" aria-required="true"></textarea>
          <p id="ta2-err" role="alert" style="margin:0;font-size:12px;color:#dc2626;">Bio is required</p>
        </div>
      </div>
    `,
    imports: [Textarea],
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    template: `
      <div style="width:375px;padding:16px;">
        <textarea muiTextarea resize="none" rows="5"
          placeholder="Write your message here…" aria-label="Message"
          style="width:100%;box-sizing:border-box;"></textarea>
      </div>
    `,
    imports: [Textarea],
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
