import { Component, inject } from '@angular/core';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { Toast } from './toast';
import { ToastContainer } from './toast-container';
import { ToastService } from './toast.service';

@Component({
  selector: 'mui-toast-demo',
  standalone: true,
  imports: [ToastContainer],
  template: `
    <div style="display:flex;flex-wrap:wrap;gap:8px;">
      <button type="button" (click)="svc.info('A new message arrived.')">Info</button>
      <button type="button" (click)="svc.success('Your changes were saved.', { title: 'Saved' })">Success</button>
      <button type="button" (click)="svc.warning('Your session expires soon.')">Warning</button>
      <button type="button" (click)="svc.danger('Could not save changes.', { title: 'Error', duration: 0 })">Danger (sticky)</button>
    </div>
    <mui-toast-container [placement]="placement" />
  `,
})
class ToastDemo {
  placement: 'top-end' | 'bottom-end' | 'bottom-center' = 'bottom-end';
  protected readonly svc = inject(ToastService);
}

const meta: Meta<ToastDemo> = {
  title: 'Feedback/Toast',
  component: ToastDemo,
  decorators: [moduleMetadata({ imports: [ToastDemo] })],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<ToastDemo>;

export const Playground: Story = {
  render: (args) => ({ props: args }),
  args: { placement: 'bottom-end' },
  argTypes: {
    placement: {
      control: 'select',
      options: ['top-start', 'top-center', 'top-end', 'bottom-start', 'bottom-center', 'bottom-end'],
    },
  },
};

/** A single toast item rendered in isolation (no service / auto-dismiss). */
export const SingleItem: StoryObj<Toast> = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:380px;">
        <mui-toast variant="info" heading="Heads up" message="Info notification" duration="0"></mui-toast>
        <mui-toast variant="success" heading="Saved" message="Changes saved" duration="0"></mui-toast>
        <mui-toast variant="warning" message="Session expiring soon" duration="0"></mui-toast>
        <mui-toast variant="danger" heading="Error" message="Something went wrong" duration="0"></mui-toast>
      </div>
    `,
    imports: [Toast],
  }),
};

export const Accessibility: Story = {
  render: (args) => ({ props: args }),
  args: { placement: 'bottom-end' },
  parameters: {
    a11y: { disable: false },
    docs: {
      description: {
        story:
          'Toasts are announced through an internal `LiveAnnouncer` (assertive for danger/warning, polite otherwise). The container is a labelled `role="region"`. Each toast pauses its auto-dismiss timer on hover/focus and can be closed with the dismiss button or Escape.',
      },
    },
  },
};
