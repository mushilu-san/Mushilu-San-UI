import type { Meta, StoryObj } from '@storybook/angular';
import { Avatar } from './avatar';

const SAMPLE_IMG = 'https://i.pravatar.cc/150?img=3';

const meta: Meta<Avatar> = {
  title: 'Primitives/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape: { control: 'select', options: ['circle', 'square'] },
    src: { control: 'text' },
    name: { control: 'text' },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<Avatar>;

export const Default: Story = {
  args: { name: 'Jane Doe', label: 'Jane Doe', size: 'md', shape: 'circle' },
};

export const WithImage: Story = {
  args: {
    src: SAMPLE_IMG,
    name: 'Jane Doe',
    label: 'Jane Doe avatar',
    size: 'md',
    shape: 'circle',
  },
};

export const Sizes: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;align-items:center;gap:16px;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-avatar size="xs" name="JD" label="Jane Doe"></mui-avatar>
          <span style="font-size:11px;color:#64748b;">xs 24px</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-avatar size="sm" name="JD" label="Jane Doe"></mui-avatar>
          <span style="font-size:11px;color:#64748b;">sm 32px</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-avatar size="md" name="JD" label="Jane Doe"></mui-avatar>
          <span style="font-size:11px;color:#64748b;">md 40px</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-avatar size="lg" name="JD" label="Jane Doe"></mui-avatar>
          <span style="font-size:11px;color:#64748b;">lg 48px</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-avatar size="xl" name="JD" label="Jane Doe"></mui-avatar>
          <span style="font-size:11px;color:#64748b;">xl 64px</span>
        </div>
      </div>
    `,
    imports: [Avatar],
  }),
};

export const Shapes: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;align-items:center;gap:24px;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
          <mui-avatar size="lg" shape="circle" name="Jane Doe" label="Jane Doe"></mui-avatar>
          <span style="font-size:12px;color:#64748b;">circle</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
          <mui-avatar size="lg" shape="square" name="Jane Doe" label="Jane Doe"></mui-avatar>
          <span style="font-size:12px;color:#64748b;">square</span>
        </div>
      </div>
    `,
    imports: [Avatar],
  }),
};

export const FallbackInitials: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;align-items:center;gap:12px;">
        <mui-avatar size="md" name="Alice" label="Alice"></mui-avatar>
        <mui-avatar size="md" name="Bob Smith" label="Bob Smith"></mui-avatar>
        <mui-avatar size="md" name="Charles Xavier" label="Charles Xavier"></mui-avatar>
        <mui-avatar size="md" label="Unknown user"></mui-avatar>
      </div>
    `,
    imports: [Avatar],
  }),
};

export const ImageFallback: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;align-items:center;gap:16px;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-avatar size="lg" src="${SAMPLE_IMG}" name="Jane Doe" label="Jane Doe"></mui-avatar>
          <span style="font-size:12px;color:#64748b;">image loaded</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <mui-avatar size="lg" src="https://broken.invalid/x.jpg" name="Jane Doe" label="Jane Doe"></mui-avatar>
          <span style="font-size:12px;color:#64748b;">broken src → initials</span>
        </div>
      </div>
    `,
    imports: [Avatar],
  }),
};

export const AvatarGroup: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;align-items:center;">
        <mui-avatar size="md" src="${SAMPLE_IMG}" name="Alice B" label="Alice B" style="outline:2px solid #fff;margin-right:-8px;z-index:4;position:relative;"></mui-avatar>
        <mui-avatar size="md" name="Bob S" label="Bob Smith" style="outline:2px solid #fff;margin-right:-8px;z-index:3;position:relative;"></mui-avatar>
        <mui-avatar size="md" name="Carol T" label="Carol T" style="outline:2px solid #fff;margin-right:-8px;z-index:2;position:relative;"></mui-avatar>
        <mui-avatar size="md" name="+5" label="5 more users" style="outline:2px solid #fff;z-index:1;position:relative;"></mui-avatar>
      </div>
    `,
    imports: [Avatar],
  }),
};

export const Accessibility: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <mui-avatar size="md" name="Jane Doe" label="Jane Doe"></mui-avatar>
          <span style="font-size:13px;color:#64748b;">role="img" + aria-label — announced by screen readers</span>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <mui-avatar size="md" src="${SAMPLE_IMG}" name="Jane Doe" label="Jane Doe avatar photo"></mui-avatar>
          <span style="font-size:13px;color:#64748b;">Image avatar — inner img is aria-hidden, host carries the label</span>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <mui-avatar size="md" label="Unknown user"></mui-avatar>
          <span style="font-size:13px;color:#64748b;">No name → "?" initials, label still set on host</span>
        </div>
      </div>
    `,
    imports: [Avatar],
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="width:375px;padding:16px;">
        <div style="display:flex;align-items:center;gap:12px;padding:12px;border:1px solid #e2e8f0;border-radius:8px;">
          <mui-avatar size="md" src="${SAMPLE_IMG}" name="Jane Doe" label="Jane Doe"></mui-avatar>
          <div>
            <p style="margin:0;font-size:14px;font-weight:600;">Jane Doe</p>
            <p style="margin:0;font-size:12px;color:#64748b;">Product Designer</p>
          </div>
        </div>
      </div>
    `,
    imports: [Avatar],
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
