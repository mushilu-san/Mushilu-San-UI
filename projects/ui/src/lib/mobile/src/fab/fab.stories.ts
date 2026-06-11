import type { Meta, StoryObj } from '@storybook/angular';
import { Fab } from './fab';

const PlusIcon = `
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
       stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14"/>
  </svg>
`;

const EditIcon = `
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
`;

const meta: Meta<Fab> = {
  title: 'Mobile/Fab',
  component: Fab,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'surface'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    extended: { control: 'boolean' },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<Fab>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<mui-fab [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading" [extended]="extended" [label]="label">${PlusIcon}</mui-fab>`,
  }),
  args: {
    variant: 'primary',
    size: 'md',
    label: 'Add item',
    disabled: false,
    loading: false,
    extended: false,
  },
};

export const Primary: Story = {
  render: () => ({
    template: `<mui-fab label="Add item">${PlusIcon}</mui-fab>`,
  }),
};

export const Secondary: Story = {
  render: () => ({
    template: `<mui-fab variant="secondary" label="Add item">${PlusIcon}</mui-fab>`,
  }),
};

export const Surface: Story = {
  render: () => ({
    template: `<mui-fab variant="surface" label="Add item">${PlusIcon}</mui-fab>`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:center;gap:24px;">
        <mui-fab size="sm" label="Add (small)">${PlusIcon}</mui-fab>
        <mui-fab size="md" label="Add (medium)">${PlusIcon}</mui-fab>
        <mui-fab size="lg" label="Add (large)">${PlusIcon}</mui-fab>
      </div>
    `,
  }),
};

export const Extended: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;align-items:flex-start;">
        <mui-fab label="Compose" extended>${EditIcon}</mui-fab>
        <mui-fab variant="secondary" label="Compose" extended>${EditIcon}</mui-fab>
      </div>
    `,
  }),
};

export const Loading: Story = {
  render: () => ({
    template: `<mui-fab label="Saving" [loading]="true">${PlusIcon}</mui-fab>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<mui-fab label="Add item" disabled>${PlusIcon}</mui-fab>`,
  }),
};

export const Interactive: Story = {
  render: (args) => ({
    props: args,
    template: `<mui-fab [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading" [extended]="extended" [label]="label">${PlusIcon}</mui-fab>`,
  }),
  args: {
    variant: 'primary',
    size: 'md',
    label: 'Add item',
    disabled: false,
    loading: false,
    extended: false,
  },
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:24px;align-items:flex-start;">
        <!-- Icon-only FAB: aria-label on the inner button -->
        <mui-fab label="Create new post">${PlusIcon}</mui-fab>
        <!-- Extended FAB: label is visible text, no aria-label needed -->
        <mui-fab label="Compose" extended>${EditIcon}</mui-fab>
        <!-- Disabled FAB keeps aria-disabled, stays in tab order -->
        <mui-fab label="Disabled action" disabled>${PlusIcon}</mui-fab>
        <!-- Loading FAB communicates busy state -->
        <mui-fab label="Saving" [loading]="true">${PlusIcon}</mui-fab>
      </div>
    `,
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    template: `
      <div style="width:375px;height:667px;background:var(--mui-color-bg);position:relative;border:1px solid var(--mui-color-border);">
        <div style="position:absolute;bottom:24px;right:24px;">
          <mui-fab label="Add item">${PlusIcon}</mui-fab>
        </div>
      </div>
    `,
  }),
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
