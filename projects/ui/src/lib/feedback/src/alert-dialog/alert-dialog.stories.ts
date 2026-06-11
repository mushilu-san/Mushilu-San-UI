import type { Meta, StoryObj } from '@storybook/angular';
import { AlertDialog } from './alert-dialog';

const meta: Meta<AlertDialog> = {
  title: 'Feedback/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    open:         { control: 'boolean' },
    heading:      { control: 'text' },
    confirmLabel: { control: 'text' },
    cancelLabel:  { control: 'text' },
    destructive:  { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<AlertDialog>;

export const Default: Story = {
  render: (args) => ({
    imports: [AlertDialog],
    props: { ...args, isOpen: false },
    template: `
      <button
        style="padding:8px 16px;border:1px solid var(--mui-color-border);border-radius:8px;background:var(--mui-color-surface-raised);cursor:pointer;color:var(--mui-color-text);font-family:var(--mui-font-sans);"
        (click)="isOpen=true"
      >Open dialog</button>

      <mui-alert-dialog
        [(open)]="isOpen"
        heading="Are you sure?"
        (confirmed)="isOpen=false"
        (cancelled)="isOpen=false"
      >
        This action cannot be undone and will permanently delete the selected item.
      </mui-alert-dialog>
    `,
  }),
};

export const Destructive: Story = {
  render: () => ({
    imports: [AlertDialog],
    props: { isOpen: false },
    template: `
      <button
        style="padding:8px 16px;border:1px solid var(--mui-color-danger);border-radius:8px;background:var(--mui-color-danger);color:#fff;cursor:pointer;font-family:var(--mui-font-sans);"
        (click)="isOpen=true"
      >Delete account</button>

      <mui-alert-dialog
        [(open)]="isOpen"
        heading="Delete account?"
        confirmLabel="Delete account"
        cancelLabel="Keep account"
        [destructive]="true"
        (confirmed)="isOpen=false"
        (cancelled)="isOpen=false"
      >
        This will permanently delete your account and all associated data.
        This action <strong>cannot</strong> be undone.
      </mui-alert-dialog>
    `,
  }),
};

export const CustomLabels: Story = {
  render: () => ({
    imports: [AlertDialog],
    props: { isOpen: false },
    template: `
      <button
        style="padding:8px 16px;border:1px solid var(--mui-color-border);border-radius:8px;background:var(--mui-color-surface-raised);cursor:pointer;color:var(--mui-color-text);font-family:var(--mui-font-sans);"
        (click)="isOpen=true"
      >Discard changes</button>

      <mui-alert-dialog
        [(open)]="isOpen"
        heading="Discard changes?"
        confirmLabel="Yes, discard"
        cancelLabel="No, keep editing"
        (confirmed)="isOpen=false"
        (cancelled)="isOpen=false"
      >
        You have unsaved changes. Discarding will lose all your work in progress.
      </mui-alert-dialog>
    `,
  }),
};

export const Accessibility: Story = {
  render: () => ({
    imports: [AlertDialog],
    props: { isOpen: true },
    template: `
      <p style="font-family:var(--mui-font-sans);font-size:13px;color:var(--mui-color-text-muted);margin-bottom:16px;">
        Dialog is open. Focus should be on "Cancel" button.<br>
        Escape is disabled — must explicitly choose an action.
      </p>
      <button
        style="padding:8px 16px;border:1px solid var(--mui-color-border);border-radius:8px;background:var(--mui-color-surface-raised);cursor:pointer;color:var(--mui-color-text);font-family:var(--mui-font-sans);"
        (click)="isOpen=true"
      >Reopen</button>
      <mui-alert-dialog
        [(open)]="isOpen"
        heading="Confirm deletion"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        [destructive]="true"
        (confirmed)="isOpen=false"
        (cancelled)="isOpen=false"
      >
        This item will be permanently removed. Review this carefully before proceeding.
      </mui-alert-dialog>
    `,
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    imports: [AlertDialog],
    props: { isOpen: false },
    template: `
      <div style="width:375px;padding:24px;">
        <button
          style="width:100%;padding:12px;border:1px solid var(--mui-color-border);border-radius:8px;background:var(--mui-color-surface-raised);cursor:pointer;color:var(--mui-color-text);font-family:var(--mui-font-sans);"
          (click)="isOpen=true"
        >Delete post</button>
        <mui-alert-dialog
          [(open)]="isOpen"
          heading="Delete post?"
          confirmLabel="Delete"
          [destructive]="true"
          (confirmed)="isOpen=false"
          (cancelled)="isOpen=false"
        >
          This post will be permanently deleted.
        </mui-alert-dialog>
      </div>
    `,
  }),
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
