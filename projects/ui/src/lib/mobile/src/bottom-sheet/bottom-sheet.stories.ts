import type { Meta, StoryObj } from '@storybook/angular';
import { BottomSheet } from './bottom-sheet';

const meta: Meta<BottomSheet> = {
  title: 'Mobile/BottomSheet',
  component: BottomSheet,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'full'] },
    showHandle: { control: 'boolean' },
    closeOnBackdrop: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<BottomSheet>;

export const Default: Story = {
  render: (args) => ({
    props: { ...args, open: false },
    template: `
      <div style="width:375px;height:667px;background:var(--mui-color-bg);display:flex;align-items:center;justify-content:center;position:relative;">
        <button style="padding:12px 24px;background:var(--mui-color-primary);color:#fff;border:none;border-radius:8px;cursor:pointer;" (click)="open=true">
          Open Sheet
        </button>
        <mui-bottom-sheet [(open)]="open" [heading]="heading" [size]="size" [showHandle]="showHandle">
          <p style="margin:0;color:var(--mui-color-text);">Bottom sheet content goes here.</p>
        </mui-bottom-sheet>
      </div>
    `,
  }),
  args: {
    heading: 'Options',
    size: 'md',
    showHandle: true,
    closeOnBackdrop: true,
    closeOnEscape: true,
  },
};

export const WithFooter: Story = {
  render: () => ({
    imports: [BottomSheet],
    props: { open: false },
    template: `
      <div style="width:375px;height:667px;background:var(--mui-color-bg);display:flex;align-items:center;justify-content:center;">
        <button style="padding:12px 24px;background:var(--mui-color-primary);color:#fff;border:none;border-radius:8px;cursor:pointer;" (click)="open=true">
          Open Sheet
        </button>
        <mui-bottom-sheet [(open)]="open" heading="Confirm action">
          <p style="margin:0;color:var(--mui-color-text);">Are you sure you want to delete this item? This action cannot be undone.</p>
          <button slot="footer" style="width:100%;padding:14px;background:var(--mui-color-danger);color:#fff;border:none;border-radius:8px;cursor:pointer;" (click)="open=false">
            Delete
          </button>
          <button slot="footer" style="width:100%;padding:14px;background:transparent;border:1px solid var(--mui-color-border);color:var(--mui-color-text);border-radius:8px;cursor:pointer;" (click)="open=false">
            Cancel
          </button>
        </mui-bottom-sheet>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    imports: [BottomSheet],
    props: { openSheet: '' },
    template: `
      <div style="width:375px;height:667px;background:var(--mui-color-bg);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;">
        <button style="width:200px;padding:12px;background:var(--mui-color-primary);color:#fff;border:none;border-radius:8px;cursor:pointer;" (click)="openSheet='sm'">Small (40vh)</button>
        <button style="width:200px;padding:12px;background:var(--mui-color-primary);color:#fff;border:none;border-radius:8px;cursor:pointer;" (click)="openSheet='md'">Medium (60vh)</button>
        <button style="width:200px;padding:12px;background:var(--mui-color-primary);color:#fff;border:none;border-radius:8px;cursor:pointer;" (click)="openSheet='lg'">Large (85vh)</button>
        <button style="width:200px;padding:12px;background:var(--mui-color-primary);color:#fff;border:none;border-radius:8px;cursor:pointer;" (click)="openSheet='full'">Full</button>

        <mui-bottom-sheet [open]="openSheet==='sm'" (closed)="openSheet=''" heading="Small sheet" size="sm">
          <p style="margin:0;color:var(--mui-color-text);">Small sheet content.</p>
        </mui-bottom-sheet>
        <mui-bottom-sheet [open]="openSheet==='md'" (closed)="openSheet=''" heading="Medium sheet" size="md">
          <p style="margin:0;color:var(--mui-color-text);">Medium sheet content.</p>
        </mui-bottom-sheet>
        <mui-bottom-sheet [open]="openSheet==='lg'" (closed)="openSheet=''" heading="Large sheet" size="lg">
          <p style="margin:0;color:var(--mui-color-text);">Large sheet content.</p>
        </mui-bottom-sheet>
        <mui-bottom-sheet [open]="openSheet==='full'" (closed)="openSheet=''" heading="Full sheet" size="full">
          <p style="margin:0;color:var(--mui-color-text);">Full sheet content.</p>
        </mui-bottom-sheet>
      </div>
    `,
  }),
};

export const Accessibility: Story = {
  render: () => ({
    imports: [BottomSheet],
    props: { open: true },
    template: `
      <div style="width:375px;height:667px;">
        <!-- Dialog role, aria-labelledby, focus trap via native dialog, Escape dismissal -->
        <mui-bottom-sheet [(open)]="open" heading="Share options">
          <p style="margin:0;color:var(--mui-color-text);">Focus is trapped inside. Press Escape or tap the close button to dismiss.</p>
        </mui-bottom-sheet>
      </div>
    `,
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    imports: [BottomSheet],
    props: { open: false },
    template: `
      <div style="width:375px;height:667px;background:var(--mui-color-bg);display:flex;align-items:center;justify-content:center;">
        <button style="padding:12px 24px;background:var(--mui-color-primary);color:#fff;border:none;border-radius:8px;cursor:pointer;" (click)="open=true">
          Open Sheet
        </button>
        <mui-bottom-sheet [(open)]="open" heading="Share">
          <p style="margin:0 0 12px;color:var(--mui-color-text);">Choose how to share this item.</p>
        </mui-bottom-sheet>
      </div>
    `,
  }),
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
