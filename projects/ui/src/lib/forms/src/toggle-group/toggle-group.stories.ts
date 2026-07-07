import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ToggleGroup } from './toggle-group';
import { ToggleGroupItem } from './toggle-group-item';

const meta: Meta = {
  title: 'Forms/ToggleGroup',
  component: ToggleGroup,
  decorators: [moduleMetadata({ imports: [ToggleGroup, ToggleGroupItem] })],
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Single: Story = {
  render: () => ({
    props: { align: 'left' },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
        <p style="margin:0;font-family:var(--mui-font-sans);font-size:13px;color:var(--mui-color-text-muted);">Selected: {{ align }}</p>
        <mui-toggle-group [(value)]="align">
          <mui-toggle-group-item value="left">Left</mui-toggle-group-item>
          <mui-toggle-group-item value="center">Center</mui-toggle-group-item>
          <mui-toggle-group-item value="right">Right</mui-toggle-group-item>
        </mui-toggle-group>
      </div>
    `,
  }),
};

export const Multiple: Story = {
  render: () => ({
    props: { formats: 'bold' },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
        <p style="margin:0;font-family:var(--mui-font-sans);font-size:13px;color:var(--mui-color-text-muted);">Selected: {{ formats || '(none)' }}</p>
        <mui-toggle-group type="multiple" [(value)]="formats">
          <mui-toggle-group-item value="bold">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M3 2h5a4 4 0 010 8H5V2zm0 8h6a4 4 0 010 8H3v-8z"/></svg>
            Bold
          </mui-toggle-group-item>
          <mui-toggle-group-item value="italic">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M7 2h5v2H9.5l-3 8H8v2H3v-2h1.5l3-8H6V2z"/></svg>
            Italic
          </mui-toggle-group-item>
          <mui-toggle-group-item value="underline">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M3 14h10v1.5H3zm1.5-12v5.5a3.5 3.5 0 007 0V2H13v5.5a5 5 0 01-10 0V2z"/></svg>
            Underline
          </mui-toggle-group-item>
        </mui-toggle-group>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;align-items:flex-start;">
        <mui-toggle-group size="sm" value="a">
          <mui-toggle-group-item value="a">Small</mui-toggle-group-item>
          <mui-toggle-group-item value="b">Medium</mui-toggle-group-item>
          <mui-toggle-group-item value="c">Large</mui-toggle-group-item>
        </mui-toggle-group>
        <mui-toggle-group size="md" value="a">
          <mui-toggle-group-item value="a">Small</mui-toggle-group-item>
          <mui-toggle-group-item value="b">Medium</mui-toggle-group-item>
          <mui-toggle-group-item value="c">Large</mui-toggle-group-item>
        </mui-toggle-group>
        <mui-toggle-group size="lg" value="a">
          <mui-toggle-group-item value="a">Small</mui-toggle-group-item>
          <mui-toggle-group-item value="b">Medium</mui-toggle-group-item>
          <mui-toggle-group-item value="c">Large</mui-toggle-group-item>
        </mui-toggle-group>
      </div>
    `,
  }),
};

export const OutlineVariant: Story = {
  render: () => ({
    props: { view: 'grid' },
    template: `
      <mui-toggle-group variant="outline" [(value)]="view">
        <mui-toggle-group-item value="list">List</mui-toggle-group-item>
        <mui-toggle-group-item value="grid">Grid</mui-toggle-group-item>
        <mui-toggle-group-item value="columns">Columns</mui-toggle-group-item>
      </mui-toggle-group>
    `,
  }),
};

export const WithDisabled: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
        <p style="margin:0;font-family:var(--mui-font-sans);font-size:13px;color:var(--mui-color-text-muted);">Group disabled</p>
        <mui-toggle-group [disabled]="true" value="b">
          <mui-toggle-group-item value="a">Option A</mui-toggle-group-item>
          <mui-toggle-group-item value="b">Option B</mui-toggle-group-item>
          <mui-toggle-group-item value="c">Option C</mui-toggle-group-item>
        </mui-toggle-group>
        <p style="margin:0;font-family:var(--mui-font-sans);font-size:13px;color:var(--mui-color-text-muted);">Item disabled</p>
        <mui-toggle-group value="a">
          <mui-toggle-group-item value="a">Option A</mui-toggle-group-item>
          <mui-toggle-group-item value="b" [disabled]="true">Option B</mui-toggle-group-item>
          <mui-toggle-group-item value="c">Option C</mui-toggle-group-item>
        </mui-toggle-group>
      </div>
    `,
  }),
};

export const Accessibility: Story = {
  render: () => ({
    props: { alignment: 'center' },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
        <p style="margin:0;font-family:var(--mui-font-sans);font-size:13px;color:var(--mui-color-text-muted);">
          Each item has <code>aria-pressed</code>. Container has <code>role="group"</code>.<br>
          Tab to navigate · Space/Enter to toggle.
        </p>
        <mui-toggle-group [(value)]="alignment">
          <mui-toggle-group-item value="left">Left</mui-toggle-group-item>
          <mui-toggle-group-item value="center">Center</mui-toggle-group-item>
          <mui-toggle-group-item value="right">Right</mui-toggle-group-item>
          <mui-toggle-group-item value="justify" [disabled]="true">Justify</mui-toggle-group-item>
        </mui-toggle-group>
      </div>
    `,
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    props: { tab: 'all' },
    template: `
      <div style="width:375px;padding:24px;">
        <mui-toggle-group [(value)]="tab" style="width:100%;">
          <mui-toggle-group-item value="all" style="flex:1;">All</mui-toggle-group-item>
          <mui-toggle-group-item value="active" style="flex:1;">Active</mui-toggle-group-item>
          <mui-toggle-group-item value="done" style="flex:1;">Done</mui-toggle-group-item>
        </mui-toggle-group>
      </div>
    `,
  }),
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
