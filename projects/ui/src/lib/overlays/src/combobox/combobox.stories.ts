import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { Combobox } from './combobox';
import { ComboboxItem } from './combobox-item';

const ALL = [Combobox, ComboboxItem];

const meta: Meta = {
  title: 'Overlays/Combobox',
  component: Combobox,
  decorators: [moduleMetadata({ imports: ALL })],
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    props: { framework: '' },
    template: `
      <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <p style="margin:0;font-family:var(--mui-font-sans);font-size:13px;color:var(--mui-color-text-muted);">Selected: {{ framework || '(none)' }}</p>
        <mui-combobox [(value)]="framework" placeholder="Select framework…">
          <mui-combobox-item value="angular">Angular</mui-combobox-item>
          <mui-combobox-item value="react">React</mui-combobox-item>
          <mui-combobox-item value="vue">Vue</mui-combobox-item>
          <mui-combobox-item value="svelte">Svelte</mui-combobox-item>
          <mui-combobox-item value="solid">SolidJS</mui-combobox-item>
        </mui-combobox>
      </div>
    `,
  }),
};

export const WithDisabledItem: Story = {
  render: () => ({
    props: { val: '' },
    template: `
      <mui-combobox [(value)]="val" placeholder="Select plan…">
        <mui-combobox-item value="free">Free</mui-combobox-item>
        <mui-combobox-item value="pro">Pro</mui-combobox-item>
        <mui-combobox-item value="enterprise" [disabled]="true">Enterprise (contact sales)</mui-combobox-item>
      </mui-combobox>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <mui-combobox [disabled]="true" placeholder="Disabled combobox">
        <mui-combobox-item value="a">Option A</mui-combobox-item>
      </mui-combobox>
    `,
  }),
};

export const Accessibility: Story = {
  render: () => ({
    props: { val: 'react' },
    template: `
      <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <p style="margin:0;font-family:var(--mui-font-sans);font-size:13px;color:var(--mui-color-text-muted);">
          aria-expanded · aria-haspopup="listbox" · options have aria-selected
        </p>
        <mui-combobox [(value)]="val" placeholder="Select framework…">
          <mui-combobox-item value="angular">Angular</mui-combobox-item>
          <mui-combobox-item value="react">React</mui-combobox-item>
          <mui-combobox-item value="vue">Vue</mui-combobox-item>
        </mui-combobox>
      </div>
    `,
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    props: { val: '' },
    template: `
      <div style="width:375px;padding:24px;">
        <mui-combobox [(value)]="val" placeholder="Choose country…" style="width:100%;">
          <mui-combobox-item value="us">United States</mui-combobox-item>
          <mui-combobox-item value="uk">United Kingdom</mui-combobox-item>
          <mui-combobox-item value="ca">Canada</mui-combobox-item>
          <mui-combobox-item value="au">Australia</mui-combobox-item>
          <mui-combobox-item value="de">Germany</mui-combobox-item>
        </mui-combobox>
      </div>
    `,
  }),
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
