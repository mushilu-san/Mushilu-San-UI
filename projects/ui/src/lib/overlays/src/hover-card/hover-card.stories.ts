import type { Meta, StoryObj } from '@storybook/angular';
import { HoverCard } from './hover-card';
import { HoverCardContent } from './hover-card-content';
import { HoverCardTrigger } from './hover-card-trigger';

const meta: Meta = {
  title: 'Overlays/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    imports: [HoverCard, HoverCardTrigger, HoverCardContent],
    template: `
      <mui-hover-card>
        <a muiHoverCardTrigger href="#" style="color:var(--mui-color-primary);font-family:var(--mui-font-sans);text-decoration:underline;">@mushilu-san</a>
        <mui-hover-card-content>
          <div style="display:flex;gap:12px;font-family:var(--mui-font-sans);">
            <div style="width:44px;height:44px;border-radius:50%;background:var(--mui-color-primary);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;flex-shrink:0;">M</div>
            <div>
              <p style="margin:0 0 2px;font-weight:600;color:var(--mui-color-text);">Mushilu San</p>
              <p style="margin:0 0 8px;font-size:13px;color:var(--mui-color-text-muted);">@mushilu-san</p>
              <p style="margin:0;font-size:13px;color:var(--mui-color-text);">Angular component library with zero runtime dependencies.</p>
            </div>
          </div>
        </mui-hover-card-content>
      </mui-hover-card>
    `,
  }),
};

export const Placements: Story = {
  render: () => ({
    imports: [HoverCard, HoverCardTrigger, HoverCardContent],
    template: `
      <div style="display:flex;gap:40px;align-items:center;padding:80px;">
        <mui-hover-card placement="top">
          <button muiHoverCardTrigger style="padding:8px 12px;border:1px solid var(--mui-color-border);border-radius:8px;background:var(--mui-color-surface-raised);cursor:pointer;font-family:var(--mui-font-sans);color:var(--mui-color-text);">Top</button>
          <mui-hover-card-content><p style="margin:0;font-family:var(--mui-font-sans);">Appears above</p></mui-hover-card-content>
        </mui-hover-card>
        <mui-hover-card placement="bottom">
          <button muiHoverCardTrigger style="padding:8px 12px;border:1px solid var(--mui-color-border);border-radius:8px;background:var(--mui-color-surface-raised);cursor:pointer;font-family:var(--mui-font-sans);color:var(--mui-color-text);">Bottom</button>
          <mui-hover-card-content><p style="margin:0;font-family:var(--mui-font-sans);">Appears below</p></mui-hover-card-content>
        </mui-hover-card>
        <mui-hover-card placement="left">
          <button muiHoverCardTrigger style="padding:8px 12px;border:1px solid var(--mui-color-border);border-radius:8px;background:var(--mui-color-surface-raised);cursor:pointer;font-family:var(--mui-font-sans);color:var(--mui-color-text);">Left</button>
          <mui-hover-card-content><p style="margin:0;font-family:var(--mui-font-sans);">Appears left</p></mui-hover-card-content>
        </mui-hover-card>
        <mui-hover-card placement="right">
          <button muiHoverCardTrigger style="padding:8px 12px;border:1px solid var(--mui-color-border);border-radius:8px;background:var(--mui-color-surface-raised);cursor:pointer;font-family:var(--mui-font-sans);color:var(--mui-color-text);">Right</button>
          <mui-hover-card-content><p style="margin:0;font-family:var(--mui-font-sans);">Appears right</p></mui-hover-card-content>
        </mui-hover-card>
      </div>
    `,
  }),
};

export const Accessibility: Story = {
  render: () => ({
    imports: [HoverCard, HoverCardTrigger, HoverCardContent],
    props: { open: true },
    template: `
      <p style="font-family:var(--mui-font-sans);font-size:13px;color:var(--mui-color-text-muted);margin-bottom:16px;">
        Trigger receives focus/blur events. Card has role="tooltip".
      </p>
      <mui-hover-card [(open)]="open">
        <a muiHoverCardTrigger href="#" style="color:var(--mui-color-primary);font-family:var(--mui-font-sans);">Focused link</a>
        <mui-hover-card-content>
          <p style="margin:0;font-family:var(--mui-font-sans);">This content is announced as a tooltip.</p>
        </mui-hover-card-content>
      </mui-hover-card>
    `,
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    imports: [HoverCard, HoverCardTrigger, HoverCardContent],
    template: `
      <div style="width:375px;padding:24px;">
        <p style="font-family:var(--mui-font-sans);margin:0 0 16px;">
          Hover cards work on mobile via focus. Tap a link to focus it.
        </p>
        <mui-hover-card [openDelay]="0">
          <a muiHoverCardTrigger href="#" style="color:var(--mui-color-primary);font-family:var(--mui-font-sans);">@mushilu-san</a>
          <mui-hover-card-content>
            <p style="margin:0;font-family:var(--mui-font-sans);font-size:14px;">Angular UI component library.</p>
          </mui-hover-card-content>
        </mui-hover-card>
      </div>
    `,
  }),
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
