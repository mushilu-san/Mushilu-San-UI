import type { Meta, StoryObj } from '@storybook/angular';
import { Sheet } from './sheet';

const triggerStyle = `padding:8px 16px;border:1px solid var(--mui-color-border);border-radius:8px;background:var(--mui-color-surface-raised);cursor:pointer;color:var(--mui-color-text);font-family:var(--mui-font-sans);`;

const meta: Meta<Sheet> = {
  title: 'Feedback/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    open:            { control: 'boolean' },
    side:            { control: 'select', options: ['left', 'right', 'top', 'bottom'] },
    size:            { control: 'select', options: ['sm', 'md', 'lg', 'full'] },
    heading:         { control: 'text' },
    closeOnBackdrop: { control: 'boolean' },
    closeOnEscape:   { control: 'boolean' },
    showClose:       { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<Sheet>;

export const Default: Story = {
  render: () => ({
    imports: [Sheet],
    props: { isOpen: false },
    template: `
      <button style="${triggerStyle}" (click)="isOpen=true">Open sheet</button>
      <mui-sheet [(open)]="isOpen" heading="Sheet title">
        <p style="margin:0;font-family:var(--mui-font-sans);color:var(--mui-color-text);">
          Sheet content goes here. You can put any content inside the sheet body.
        </p>
      </mui-sheet>
    `,
  }),
};

export const Sides: Story = {
  render: () => ({
    imports: [Sheet],
    props: { openSide: null as string | null },
    template: `
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button style="${triggerStyle}" (click)="openSide='right'">Right</button>
        <button style="${triggerStyle}" (click)="openSide='left'">Left</button>
        <button style="${triggerStyle}" (click)="openSide='top'">Top</button>
        <button style="${triggerStyle}" (click)="openSide='bottom'">Bottom</button>
      </div>

      <mui-sheet [(open)]="rightOpen" side="right" heading="Right sheet" *ngIf="openSide==='right'; rightOpen=true">
        <p style="margin:0;font-family:var(--mui-font-sans);">Slides in from the right.</p>
      </mui-sheet>
      <mui-sheet [(open)]="leftOpen" side="left" heading="Left sheet" *ngIf="openSide==='left'; leftOpen=true">
        <p style="margin:0;font-family:var(--mui-font-sans);">Slides in from the left.</p>
      </mui-sheet>
      <mui-sheet [(open)]="topOpen" side="top" heading="Top sheet" *ngIf="openSide==='top'; topOpen=true">
        <p style="margin:0;font-family:var(--mui-font-sans);">Slides in from the top.</p>
      </mui-sheet>
      <mui-sheet [(open)]="bottomOpen" side="bottom" heading="Bottom sheet" *ngIf="openSide==='bottom'; bottomOpen=true">
        <p style="margin:0;font-family:var(--mui-font-sans);">Slides in from the bottom.</p>
      </mui-sheet>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    imports: [Sheet],
    props: { openSize: null as string | null },
    template: `
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button style="${triggerStyle}" (click)="openSize='sm'">Small</button>
        <button style="${triggerStyle}" (click)="openSize='md'">Medium</button>
        <button style="${triggerStyle}" (click)="openSize='lg'">Large</button>
        <button style="${triggerStyle}" (click)="openSize='full'">Full</button>
      </div>
      <mui-sheet [open]="openSize==='sm'" (closed)="openSize=null" side="right" size="sm" heading="Small sheet">
        <p style="margin:0;font-family:var(--mui-font-sans);">320px wide.</p>
      </mui-sheet>
      <mui-sheet [open]="openSize==='md'" (closed)="openSize=null" side="right" size="md" heading="Medium sheet">
        <p style="margin:0;font-family:var(--mui-font-sans);">400px wide (default).</p>
      </mui-sheet>
      <mui-sheet [open]="openSize==='lg'" (closed)="openSize=null" side="right" size="lg" heading="Large sheet">
        <p style="margin:0;font-family:var(--mui-font-sans);">540px wide.</p>
      </mui-sheet>
      <mui-sheet [open]="openSize==='full'" (closed)="openSize=null" side="right" size="full" heading="Full sheet">
        <p style="margin:0;font-family:var(--mui-font-sans);">Full viewport width.</p>
      </mui-sheet>
    `,
  }),
};

export const WithFooter: Story = {
  render: () => ({
    imports: [Sheet],
    props: { isOpen: false },
    template: `
      <button style="${triggerStyle}" (click)="isOpen=true">Edit profile</button>
      <mui-sheet [(open)]="isOpen" heading="Edit profile">
        <div style="display:flex;flex-direction:column;gap:16px;font-family:var(--mui-font-sans);">
          <label style="display:flex;flex-direction:column;gap:4px;">
            <span style="font-size:13px;color:var(--mui-color-text-muted);">Name</span>
            <input style="padding:8px;border:1px solid var(--mui-color-border);border-radius:6px;background:var(--mui-color-surface);" value="Moris Zakay" />
          </label>
          <label style="display:flex;flex-direction:column;gap:4px;">
            <span style="font-size:13px;color:var(--mui-color-text-muted);">Email</span>
            <input style="padding:8px;border:1px solid var(--mui-color-border);border-radius:6px;background:var(--mui-color-surface);" value="moris@example.com" />
          </label>
        </div>
        <div slot="footer" style="display:flex;justify-content:flex-end;gap:8px;padding:16px;border-top:1px solid var(--mui-color-border);">
          <button style="${triggerStyle}" (click)="isOpen=false">Cancel</button>
          <button style="padding:8px 16px;border:none;border-radius:8px;background:var(--mui-color-primary);color:var(--mui-color-primary-text);cursor:pointer;font-family:var(--mui-font-sans);" (click)="isOpen=false">Save changes</button>
        </div>
      </mui-sheet>
    `,
  }),
};

export const Accessibility: Story = {
  render: () => ({
    imports: [Sheet],
    props: { isOpen: true },
    template: `
      <button style="${triggerStyle}" (click)="isOpen=true">Reopen</button>
      <mui-sheet [(open)]="isOpen" heading="Accessible sheet" side="right">
        <p style="margin:0;font-family:var(--mui-font-sans);color:var(--mui-color-text);">
          Focus is trapped inside the sheet while open.<br>
          Press Escape or click the × button to close.
        </p>
      </mui-sheet>
    `,
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    imports: [Sheet],
    props: { isOpen: false },
    template: `
      <div style="width:375px;padding:24px;">
        <button style="width:100%;${triggerStyle}" (click)="isOpen=true">Open sheet</button>
        <mui-sheet [(open)]="isOpen" side="bottom" heading="Options">
          <div style="display:flex;flex-direction:column;gap:0;font-family:var(--mui-font-sans);">
            <button style="padding:14px 0;border:none;background:none;text-align:left;cursor:pointer;color:var(--mui-color-text);">Share</button>
            <button style="padding:14px 0;border:none;background:none;text-align:left;cursor:pointer;color:var(--mui-color-text);">Copy link</button>
            <button style="padding:14px 0;border:none;background:none;text-align:left;cursor:pointer;color:var(--mui-color-danger);">Delete</button>
          </div>
        </mui-sheet>
      </div>
    `,
  }),
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
