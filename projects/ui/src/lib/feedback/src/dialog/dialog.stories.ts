import { Component, signal } from '@angular/core';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { Dialog } from './dialog';

@Component({
  selector: 'mui-dialog-demo',
  standalone: true,
  imports: [Dialog],
  template: `
    <button type="button" (click)="open.set(true)">Open dialog</button>

    <mui-dialog
      [open]="open()"
      (openChange)="open.set($event)"
      [heading]="heading"
      [size]="size"
      [closeOnBackdrop]="closeOnBackdrop"
      [closeOnEscape]="closeOnEscape"
    >
      <p style="margin:0;">
        This action cannot be undone. This will permanently delete the item and remove its data.
      </p>
      <div slot="footer">
        <button type="button" (click)="open.set(false)">Cancel</button>
        <button type="button" (click)="open.set(false)">Confirm</button>
      </div>
    </mui-dialog>
  `,
})
class DialogDemo {
  heading = 'Delete item?';
  size: 'sm' | 'md' | 'lg' = 'md';
  closeOnBackdrop = true;
  closeOnEscape = true;
  readonly open = signal(false);
}

const meta: Meta<DialogDemo> = {
  title: 'Feedback/Dialog',
  component: DialogDemo,
  decorators: [moduleMetadata({ imports: [DialogDemo] })],
  parameters: { layout: 'centered' },
  argTypes: {
    heading: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    closeOnBackdrop: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<DialogDemo>;

export const Playground: Story = {
  render: (args) => ({ props: args }),
  args: { heading: 'Delete item?', size: 'md', closeOnBackdrop: true, closeOnEscape: true },
};

export const Accessibility: Story = {
  render: (args) => ({ props: args }),
  args: { heading: 'Accessible dialog', size: 'md', closeOnBackdrop: true, closeOnEscape: true },
  parameters: {
    a11y: { disable: false },
    docs: {
      description: {
        story:
          'Built on the native `<dialog>` element: focus is trapped while open and returned to the trigger on close, `aria-modal` and `role="dialog"` are implicit, and the heading is wired via `aria-labelledby`. Escape and backdrop clicks close it (configurable).',
      },
    },
  },
};

export const MobilePreview: Story = {
  render: (args) => ({ props: args }),
  args: { heading: 'Confirm', size: 'sm', closeOnBackdrop: true, closeOnEscape: true },
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
