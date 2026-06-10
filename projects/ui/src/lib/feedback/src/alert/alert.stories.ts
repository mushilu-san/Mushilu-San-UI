import type { Meta, StoryObj } from '@storybook/angular';
import { Alert } from './alert';

const meta: Meta<Alert> = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'warning', 'danger'] },
    heading: { control: 'text' },
    dismissible: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Alert>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <mui-alert [variant]="variant" [heading]="heading" [dismissible]="dismissible">
        Your changes have been saved.
      </mui-alert>
    `,
    imports: [Alert],
  }),
  args: { variant: 'info', heading: 'Heads up', dismissible: false },
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:520px;">
        <mui-alert variant="info" heading="Information">A new version is available.</mui-alert>
        <mui-alert variant="success" heading="Success">Your profile was updated.</mui-alert>
        <mui-alert variant="warning" heading="Warning">Your trial ends in 3 days.</mui-alert>
        <mui-alert variant="danger" heading="Error">We couldn't process your payment.</mui-alert>
      </div>
    `,
    imports: [Alert],
  }),
};

export const Dismissible: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:520px;">
        <mui-alert variant="warning" heading="Storage almost full" dismissible
          (dismissed)="onDismiss()">
          You have used 92% of your quota.
        </mui-alert>
      </div>
    `,
    props: { onDismiss: () => console.log('alert dismissed') },
    imports: [Alert],
  }),
};

export const WithoutHeading: Story = {
  render: () => ({
    template: `
      <mui-alert variant="success" style="max-width:520px;">
        Saved automatically just now.
      </mui-alert>
    `,
    imports: [Alert],
  }),
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:520px;">
        <mui-alert variant="success" heading="role=status (polite)">
          Non-urgent updates announce politely without interrupting.
        </mui-alert>
        <mui-alert variant="danger" heading="role=alert (assertive)" dismissible>
          Urgent errors interrupt screen readers; dismiss with the button or Escape.
        </mui-alert>
      </div>
    `,
    imports: [Alert],
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    template: `
      <div style="width:375px;display:flex;flex-direction:column;gap:12px;">
        <mui-alert variant="info" heading="Update" dismissible>
          Pull to refresh for the latest data.
        </mui-alert>
        <mui-alert variant="danger" heading="Offline">
          You are currently offline.
        </mui-alert>
      </div>
    `,
    imports: [Alert],
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
